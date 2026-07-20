import { useEffect, useState, useRef, useCallback } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { ChevronLeft, ChevronRight, Crown, ExternalLink, Search, Shield, Star, Trash2, Zap, Monitor, Key, Activity, Clock } from 'lucide-react'

interface User {
  id: string
  email: string
  displayName: string
  tier: string
  subscriptionStatus: string
  currentPeriodEnd: string | null
  stripeCustomerId: string | null
  isAdmin: boolean
  emailVerified: boolean
  messageCount: number
  createdAt: string
  lastActive: string | null
}

interface UserDetail {
  id: string
  email: string
  displayName: string
  emailVerified: boolean
  isAdmin: boolean
  createdAt: string
  updatedAt: string
  subscription: {
    id: string
    tier: string
    tierName: string
    tierPrice: string
    status: string
    currentPeriodStart: string | null
    currentPeriodEnd: string | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    cancelAtPeriodEnd: boolean
    createdAt: string
    isFounding: boolean
  } | null
  devices: { id: number; deviceId: string; deviceName: string | null; lastSeen: string; createdAt: string }[]
  licenses: { id: string; deviceId: string | null; status: string; activatedAt: string | null; lastValidatedAt: string | null; createdAt: string }[]
  usage: { messages30d: number; activeDays30d: number; lastActiveDay: string | null; promptTokens: number; completionTokens: number; requestCount: number; costCents: number }
  dailyUsage: { date: string; count: number }[]
  activity: { id: string; tool: string; args: any; result: string | null; tier: string | null; riskLevel: string | null; createdAt: string }[]
}

const TIER_META: Record<string, { name: string; dot: string; icon: typeof Crown; group: string }> = {
  'founding-studio-plus': { name: 'Founding Partner', dot: 'bg-amber-400', icon: Crown, group: 'Founding' },
  'founding-studio': { name: 'Founding Studio', dot: 'bg-cyan-400', icon: Crown, group: 'Founding' },
  'founding-pro': { name: 'Founding Pro', dot: 'bg-brand-400', icon: Zap, group: 'Founding' },
  'founding-pro-early': { name: 'Founding Pro · Early Bird', dot: 'bg-brand-300', icon: Zap, group: 'Founding' },
  access: { name: 'Founding Access', dot: 'bg-emerald-400', icon: Star, group: 'Founding' },
  enterprise: { name: 'Enterprise', dot: 'bg-purple-400', icon: Shield, group: 'GA' },
  team: { name: 'Studio', dot: 'bg-cyan-400', icon: Crown, group: 'GA' },
  pro: { name: 'Pro', dot: 'bg-brand-400', icon: Zap, group: 'GA' },
  free: { name: 'Community', dot: 'bg-gray-400', icon: Star, group: 'GA' },
}

function TierPill({ tier }: { tier: string }) {
  const meta = TIER_META[tier] || TIER_META.free
  const isFounding = meta.group === 'Founding'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
      isFounding ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.name}
    </span>
  )
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = { active: 'bg-green-400', trial: 'bg-yellow-400', past_due: 'bg-red-400', canceled: 'bg-gray-500', inactive: 'bg-gray-500' }
  const labels: Record<string, string> = { active: 'Active', trial: 'Trial', past_due: 'Past due', canceled: 'Canceled', inactive: 'Inactive' }
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-dim)]">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[status] || colors.inactive}`} />
      {labels[status] || status}
    </span>
  )
}

function relativeTime(d: string | null) {
  if (!d) return '—'
  const now = Date.now()
  const date = new Date(d).getTime()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}

export default function AdminUsers() {
  const { adminFetch } = useAdmin()
  const adminFetchRef = useRef(adminFetch)
  adminFetchRef.current = adminFetch

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const limit = 20

  // Modals
  const [changingTier, setChangingTier] = useState<string | null>(null)
  const [newTier, setNewTier] = useState('free')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detail, setDetail] = useState<UserDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [staleFilter, setStaleFilter] = useState<number | null>(null)
  const [staleUsers, setStaleUsers] = useState<User[]>([])
  const [staleLoading, setStaleLoading] = useState(false)

  const loadUsers = useCallback(async (searchTerm: string, pageNum: number) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: String(limit) })
      if (searchTerm) params.set('search', searchTerm)
      const data = await adminFetchRef.current<{ users: User[]; total: number; pages: number }>(`/users?${params}`)
      setUsers(data.users)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers(search, page)
  }, [search, page, loadUsers])

  const loadDetail = async (userId: string) => {
    setDetailId(userId)
    setDetailLoading(true)
    setDetail(null)
    try {
      const data = await adminFetchRef.current<UserDetail>(`/users/${userId}`)
      setDetail(data)
    } catch (err: any) {
      console.error('Failed to load user detail:', err.message)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setStaleFilter(null)
    loadUsers(search, 1)
  }

  const loadStaleUsers = async (days: number) => {
    setStaleFilter(days)
    setStaleLoading(true)
    try {
      const data = await adminFetchRef.current<{ users: User[]; total: number; thresholdDays: number }>(`/users/stale?days=${days}`)
      setStaleUsers(data.users)
    } catch (err: any) {
      console.error('Failed to load stale users:', err.message)
    } finally {
      setStaleLoading(false)
    }
  }

  const clearStaleFilter = () => {
    setStaleFilter(null)
    setStaleUsers([])
    loadUsers(search, page)
  }

  const handleTierChange = async (userId: string) => {
    try {
      await adminFetchRef.current(`/users/${userId}/tier`, {
        method: 'PATCH',
        body: JSON.stringify({ tier: newTier }),
      })
      setChangingTier(null)
      setNewTier('free')
      loadUsers(search, page)
      if (detailId === userId) loadDetail(userId)
    } catch (err: any) {
      alert('Failed to change tier: ' + err.message)
    }
  }

  const handleToggleAdmin = async (userId: string, currentAdmin: boolean) => {
    try {
      await adminFetchRef.current(`/users/${userId}/admin`, {
        method: 'PATCH',
        body: JSON.stringify({ isAdmin: !currentAdmin }),
      })
      loadUsers(search, page)
      if (detailId === userId) loadDetail(userId)
    } catch (err: any) {
      alert('Failed to update admin status: ' + err.message)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      await adminFetchRef.current(`/users/${userId}`, { method: 'DELETE' })
      setDeleting(null)
      setDetailId(null)
      setDetail(null)
      loadUsers(search, page)
    } catch (err: any) {
      alert('Failed to delete user: ' + err.message)
    }
  }

  const sub = detail?.subscription

  return (
    <div className="flex h-full">
      {/* User list */}
      <div className={`flex-1 p-8 max-w-4xl ${detailId ? 'hidden md:block' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-[var(--text-dim)] text-sm mt-0.5">{staleFilter ? `${staleUsers.length} stale` : `${total.toLocaleString()} total`}</p>
          </div>
          <div className="flex items-center gap-2">
            {staleFilter ? (
              <button onClick={clearStaleFilter} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] transition-colors">
                Show all
              </button>
            ) : (
              <>
                <button onClick={() => loadStaleUsers(7)} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-yellow-400 transition-colors inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 7d inactive
                </button>
                <button onClick={() => loadStaleUsers(14)} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-yellow-400 transition-colors inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 14d inactive
                </button>
                <button onClick={() => loadStaleUsers(30)} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] hover:text-yellow-400 transition-colors inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 30d inactive
                </button>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-5 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 outline-none transition-colors"
            />
          </div>
          <button type="submit" className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            Search
          </button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          {(loading || staleLoading) ? (
            <div className="text-center py-16 text-[var(--text-dim)]">Loading...</div>
          ) : (staleFilter ? staleUsers : users).length === 0 ? (
            <div className="text-center py-16 text-[var(--text-dim)]">{staleFilter ? 'No stale users found' : 'No users found'}</div>
          ) : (
            (staleFilter ? staleUsers : users).map(user => (
              <div
                key={user.id}
                className={`group flex items-center gap-4 px-4 py-3 rounded-xl bg-[var(--surface)] border transition-all cursor-pointer ${
                  detailId === user.id ? 'border-brand-500/40 bg-brand-500/5' : 'border-[var(--border)] hover:border-brand-500/20'
                }`}
                onClick={() => loadDetail(user.id)}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/20 to-cyan-500/10 flex items-center justify-center text-sm font-bold text-brand-400 shrink-0">
                  {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text)] truncate">{user.displayName || '—'}</span>
                    {user.isAdmin && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-semibold uppercase tracking-wider">Admin</span>}
                  </div>
                  <p className="text-xs text-[var(--text-dim)] truncate">{user.email}</p>
                </div>
                <div className="hidden sm:block shrink-0"><TierPill tier={user.tier} /></div>
                <div className="hidden md:block w-20 shrink-0"><StatusDot status={user.subscriptionStatus} /></div>
                <div className="hidden lg:block w-14 text-xs text-[var(--text-dim)] text-right shrink-0">{relativeTime(user.lastActive)}</div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setChangingTier(user.id); setNewTier(user.tier || 'free') }} className="px-2 py-1 rounded text-xs bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors">Tier</button>
                  <button onClick={() => handleToggleAdmin(user.id, user.isAdmin)} className={`px-2 py-1 rounded text-xs transition-colors ${user.isAdmin ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-[var(--surface-2)] text-[var(--text-dim)] hover:text-[var(--text)]'}`}>
                    {user.isAdmin ? 'Unadmin' : 'Admin'}
                  </button>
                  <button onClick={() => setDeleting(user.id)} className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <p className="text-xs text-[var(--text-dim)]">{total.toLocaleString()} users · page {page} of {pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors inline-flex items-center gap-1"><ChevronLeft className="w-3 h-3" /> Prev</button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors inline-flex items-center gap-1">Next <ChevronRight className="w-3 h-3" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {detailId && (
        <div className="w-[420px] shrink-0 border-l border-[var(--border)] bg-[var(--surface)] overflow-y-auto">
          {detailLoading ? (
            <div className="flex items-center justify-center h-full text-[var(--text-dim)]">Loading...</div>
          ) : detail ? (
            <div className="p-5">
              {/* Close */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => { setDetailId(null); setDetail(null) }} className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors md:hidden">← Back</button>
                <button onClick={() => { setDetailId(null); setDetail(null) }} className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors ml-auto hidden md:block">✕</button>
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500/25 to-cyan-500/15 flex items-center justify-center text-lg font-bold text-brand-400">
                  {detail.displayName?.[0]?.toUpperCase() || detail.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text)]">{detail.displayName || 'No display name'}</p>
                  <p className="text-sm text-[var(--text-dim)]">{detail.email}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-5">
                {sub && <TierPill tier={sub.tier} />}
                {sub && <StatusDot status={sub.status} />}
                {detail.isAdmin && <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium border border-amber-500/20">Admin</span>}
                {detail.emailVerified && <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium border border-green-500/20">Verified</span>}
              </div>

              {/* Section: Subscription / Billing */}
              {sub && (
                <div className="mb-5">
                  <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">Subscription & Billing</h3>
                  <div className="bg-[var(--bg)] rounded-xl p-4 space-y-2.5 text-sm">
                    <div className="flex justify-between"><span className="text-[var(--text-dim)]">Plan</span><span className="text-[var(--text)] font-medium">{sub.tierName} {sub.isFounding ? '· one-time' : '· monthly'}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-dim)]">Price</span><span className="text-[var(--text)]">{sub.tierPrice}</span></div>
                    {sub.currentPeriodStart && <div className="flex justify-between"><span className="text-[var(--text-dim)]">Started</span><span className="text-[var(--text)]">{formatDate(sub.currentPeriodStart)}</span></div>}
                    {sub.currentPeriodEnd && <div className="flex justify-between"><span className="text-[var(--text-dim)]">{sub.isFounding ? 'Valid until' : 'Renews'}</span><span className="text-[var(--text)]">{sub.isFounding ? 'Lifetime' : formatDate(sub.currentPeriodEnd)}</span></div>}
                    {sub.stripeCustomerId && (
                      <div className="flex justify-between items-center pt-1 border-t border-[var(--border)]">
                        <span className="text-[var(--text-dim)]">Stripe</span>
                        <a href={`https://dashboard.stripe.com/customers/${sub.stripeCustomerId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs font-mono transition-colors">
                          {sub.stripeCustomerId.slice(0, 16)}...<ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section: Usage */}
              <div className="mb-5">
                <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">Usage (30d)</h3>
                <div className="bg-[var(--bg)] rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider mb-0.5">Messages</p>
                      <p className="text-[var(--text)] font-medium text-lg">{formatNumber(detail.usage.messages30d)}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider mb-0.5">Active days</p>
                      <p className="text-[var(--text)] font-medium text-lg">{detail.usage.activeDays30d}<span className="text-[var(--text-dim)] text-xs font-normal">/30</span></p>
                    </div>
                    <div>
                      <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider mb-0.5">Tokens in</p>
                      <p className="text-[var(--text)] font-medium">{formatNumber(detail.usage.promptTokens)}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider mb-0.5">Tokens out</p>
                      <p className="text-[var(--text)] font-medium">{formatNumber(detail.usage.completionTokens)}</p>
                    </div>
                    {detail.usage.costCents > 0 && (
                      <div className="col-span-2">
                        <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider mb-0.5">Est. cost</p>
                        <p className="text-[var(--text)] font-medium">${(detail.usage.costCents / 100).toFixed(2)}</p>
                      </div>
                    )}
                  </div>

                  {/* Daily usage sparkline */}
                  {detail.dailyUsage.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border)]">
                      <p className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">Daily messages (14d)</p>
                      <div className="flex items-end gap-0.5 h-12">
                        {detail.dailyUsage.map((d, i) => {
                          const max = Math.max(...detail.dailyUsage.map(x => x.count), 1)
                          const height = Math.max(2, (d.count / max) * 100)
                          return (
                            <div key={i} className="flex-1 bg-brand-500/30 rounded-sm hover:bg-brand-500/50 transition-colors" style={{ height: `${height}%` }} title={`${d.count} on ${d.date}`} />
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section: Devices */}
              {detail.devices.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">Devices</h3>
                  <div className="space-y-1.5">
                    {detail.devices.map(d => (
                      <div key={d.id} className="flex items-center gap-2 bg-[var(--bg)] rounded-lg px-3 py-2 text-sm">
                        <Monitor className="w-3.5 h-3.5 text-[var(--text-dim)]" />
                        <span className="text-[var(--text)] flex-1 truncate">{d.deviceName || d.deviceId}</span>
                        <span className="text-[var(--text-dim)] text-xs">{relativeTime(d.lastSeen)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section: License Keys */}
              {detail.licenses.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">License Keys</h3>
                  <div className="space-y-1.5">
                    {detail.licenses.map(l => (
                      <div key={l.id} className="flex items-center gap-2 bg-[var(--bg)] rounded-lg px-3 py-2 text-sm">
                        <Key className="w-3.5 h-3.5 text-[var(--text-dim)]" />
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${l.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                          {l.status}
                        </span>
                        {l.deviceId && <span className="text-[var(--text-dim)] text-xs truncate">{l.deviceId}</span>}
                        {l.activatedAt && <span className="text-[var(--text-dim)] text-xs ml-auto">{formatDate(l.activatedAt)}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section: Recent Activity */}
              {detail.activity.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">Recent Activity</h3>
                  <div className="space-y-1.5">
                    {detail.activity.slice(0, 10).map(a => (
                      <div key={a.id} className="flex items-start gap-2 bg-[var(--bg)] rounded-lg px-3 py-2 text-sm">
                        <Activity className="w-3.5 h-3.5 text-[var(--text-dim)] mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[var(--text)]">{a.tool}</p>
                          {a.riskLevel && a.riskLevel !== 'low' && <span className={`text-[10px] px-1.5 py-0.5 rounded ${a.riskLevel === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{a.riskLevel}</span>}
                        </div>
                        <span className="text-[var(--text-dim)] text-xs shrink-0">{relativeTime(a.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section: Account */}
              <div className="mb-5">
                <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-dim)] font-semibold mb-2">Account</h3>
                <div className="bg-[var(--bg)] rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--text-dim)]">User ID</span><span className="text-[var(--text)] font-mono text-xs">{detail.id}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-dim)]">Created</span><span className="text-[var(--text)]">{formatDate(detail.createdAt)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-dim)]">Last active</span><span className="text-[var(--text)]">{relativeTime(detail.usage.lastActiveDay)}</span></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => { setChangingTier(detailId); setNewTier(sub?.tier || 'free') }} className="flex-1 px-3 py-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 text-sm font-medium transition-colors">
                  Change tier
                </button>
                <button onClick={() => { handleToggleAdmin(detailId, detail.isAdmin) }} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  detail.isAdmin ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-[var(--surface-2)] text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}>
                  {detail.isAdmin ? 'Remove admin' : 'Make admin'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--text-dim)]">Failed to load</div>
          )}
        </div>
      )}

      {/* Change tier modal */}
      {changingTier && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setChangingTier(null)}>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-1">Change tier</h3>
            <p className="text-sm text-[var(--text-dim)] mb-5">
              for <strong className="text-[var(--text)]">{users.find(u => u.id === changingTier)?.email}</strong>
            </p>
            <div className="space-y-1 mb-2">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-medium px-1">Founding · one-time</p>
              {[
                { value: 'access', label: 'Founding Access', sub: '$15' },
                { value: 'founding-pro-early', label: 'Founding Pro · Early Bird', sub: '$50' },
                { value: 'founding-pro', label: 'Founding Pro', sub: '$100' },
                { value: 'founding-studio', label: 'Founding Studio', sub: '$250' },
                { value: 'founding-studio-plus', label: 'Founding Partner', sub: '$600' },
              ].map(opt => (
                <label key={opt.value} className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  newTier === opt.value ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'hover:bg-[var(--surface-2)] border border-transparent'
                }`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="tier" value={opt.value} checked={newTier === opt.value} onChange={() => setNewTier(opt.value)} className="sr-only" />
                    <span className="text-sm">{opt.label}</span>
                  </div>
                  <span className="text-xs text-[var(--text-dim)]">{opt.sub}</span>
                </label>
              ))}
              <div className="my-2" />
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-medium px-1">GA · monthly</p>
              {[
                { value: 'free', label: 'Community', sub: '$0' },
                { value: 'pro', label: 'Pro', sub: '$30/mo' },
                { value: 'team', label: 'Studio', sub: '$60/mo' },
                { value: 'enterprise', label: 'Enterprise', sub: 'Custom' },
              ].map(opt => (
                <label key={opt.value} className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  newTier === opt.value ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30' : 'hover:bg-[var(--surface-2)] border border-transparent'
                }`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="tier" value={opt.value} checked={newTier === opt.value} onChange={() => setNewTier(opt.value)} className="sr-only" />
                    <span className="text-sm">{opt.label}</span>
                  </div>
                  <span className="text-xs text-[var(--text-dim)]">{opt.sub}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-[var(--text-dim)] mb-5 px-1">
              {newTier.startsWith('founding-') || newTier === 'access' ? '⚡ One-time purchase with lifetime access.' : newTier === 'free' ? '↓ Cancels any existing subscription.' : '🔄 Monthly subscription — 1-month billing period.'}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setChangingTier(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-dim)] text-sm hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              <button onClick={() => handleTierChange(changingTier)} className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleting(null)}>
          <div className="bg-[var(--surface)] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-red-400 mb-1">Delete user</h3>
            <p className="text-sm text-[var(--text-dim)] mb-5">
              Permanently delete <strong className="text-[var(--text)]">{users.find(u => u.id === deleting)?.email}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleting(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-dim)] text-sm hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleting)} className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}