import { useEffect, useState, useRef, useCallback } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { ChevronLeft, ChevronRight, Crown, ExternalLink, Search, Shield, Star, Trash2, Zap } from 'lucide-react'

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
  const Icon = meta.icon
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
  const colors: Record<string, string> = {
    active: 'bg-green-400',
    trial: 'bg-yellow-400',
    past_due: 'bg-red-400',
    canceled: 'bg-gray-500',
    inactive: 'bg-gray-500',
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-dim)]">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[status] || colors.inactive}`} />
      {status || 'inactive'}
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
  if (mins < 60) return `${mins}m`
  if (hours < 24) return `${hours}h`
  if (days < 30) return `${days}d`
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
  const [detailUser, setDetailUser] = useState<User | null>(null)

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadUsers(search, 1)
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
    } catch (err: any) {
      alert('Failed to update admin status: ' + err.message)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      await adminFetchRef.current(`/users/${userId}`, { method: 'DELETE' })
      setDeleting(null)
      loadUsers(search, page)
    } catch (err: any) {
      alert('Failed to delete user: ' + err.message)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-[var(--text-dim)] text-sm mt-0.5">{total.toLocaleString()} total</p>
        </div>
      </div>

      {/* Search */}
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

      {/* User list */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-16 text-[var(--text-dim)]">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-dim)]">No users found</div>
        ) : (
          users.map(user => (
            <div
              key={user.id}
              className="group flex items-center gap-4 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-brand-500/30 transition-all cursor-pointer"
              onClick={() => setDetailUser(user)}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/20 to-cyan-500/10 flex items-center justify-center text-sm font-bold text-brand-400 shrink-0">
                {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>

              {/* Name + email */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text)] truncate">{user.displayName || '—'}</span>
                  {user.isAdmin && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-semibold uppercase tracking-wider">Admin</span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-dim)] truncate">{user.email}</p>
              </div>

              {/* Tier */}
              <div className="hidden sm:block shrink-0">
                <TierPill tier={user.tier} />
              </div>

              {/* Status */}
              <div className="hidden md:block w-20 shrink-0">
                <StatusDot status={user.subscriptionStatus} />
              </div>

              {/* Last active */}
              <div className="hidden lg:block w-14 text-xs text-[var(--text-dim)] text-right shrink-0">
                {relativeTime(user.lastActive)}
              </div>

              {/* Actions (on hover) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => { setChangingTier(user.id); setNewTier(user.tier || 'free') }}
                  className="px-2 py-1 rounded text-xs bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors"
                >
                  Tier
                </button>
                <button
                  onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    user.isAdmin ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-[var(--surface-2)] text-[var(--text-dim)] hover:text-[var(--text)]'
                  }`}
                >
                  {user.isAdmin ? 'Unadmin' : 'Admin'}
                </button>
                <button
                  onClick={() => setDeleting(user.id)}
                  className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-xs text-[var(--text-dim)]">
            {total.toLocaleString()} users · page {page} of {pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" /> Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors inline-flex items-center gap-1"
            >
              Next <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* User detail panel */}
      {detailUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDetailUser(null)}>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-[var(--border)]">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500/25 to-cyan-500/15 flex items-center justify-center text-lg font-bold text-brand-400">
                {detailUser.displayName?.[0]?.toUpperCase() || detailUser.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--text)]">{detailUser.displayName || 'No display name'}</p>
                <p className="text-sm text-[var(--text-dim)]">{detailUser.email}</p>
              </div>
              <button onClick={() => setDetailUser(null)} className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-dim)] transition-colors">✕</button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Tier + Status row */}
              <div className="flex items-center gap-3">
                <TierPill tier={detailUser.tier} />
                <StatusDot status={detailUser.subscriptionStatus} />
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-[var(--bg)] rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] mb-1">User ID</p>
                  <p className="font-mono text-xs text-[var(--text)] truncate">{detailUser.id}</p>
                </div>
                <div className="bg-[var(--bg)] rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] mb-1">Messages</p>
                  <p className="text-[var(--text)]">{detailUser.messageCount?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-[var(--bg)] rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] mb-1">Created</p>
                  <p className="text-[var(--text)]">{new Date(detailUser.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="bg-[var(--bg)] rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] mb-1">Last active</p>
                  <p className="text-[var(--text)]">{relativeTime(detailUser.lastActive)}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2">
                {detailUser.isAdmin && <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium border border-amber-500/20">Admin</span>}
                {detailUser.emailVerified && <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium border border-green-500/20">Verified</span>}
              </div>

              {/* Stripe */}
              {detailUser.stripeCustomerId && (
                <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--text-dim)]" />
                  <span className="text-xs text-[var(--text-dim)]">Stripe</span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{detailUser.stripeCustomerId}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-5 pt-0">
              <button
                onClick={() => { setChangingTier(detailUser.id); setNewTier(detailUser.tier || 'free'); setDetailUser(null) }}
                className="flex-1 px-3 py-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 text-sm font-medium transition-colors"
              >
                Change tier
              </button>
              <button
                onClick={() => { handleToggleAdmin(detailUser.id, detailUser.isAdmin); setDetailUser(null) }}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  detailUser.isAdmin ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-[var(--surface-2)] text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}
              >
                {detailUser.isAdmin ? 'Remove admin' : 'Make admin'}
              </button>
            </div>
          </div>
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
              {newTier.startsWith('founding-') || newTier === 'access'
                ? '⚡ One-time purchase with lifetime access.'
                : newTier === 'free'
                  ? '↓ Cancels any existing subscription.'
                  : '🔄 Monthly subscription — 1-month billing period.'}
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