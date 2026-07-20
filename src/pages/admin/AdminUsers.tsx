import { useEffect, useState, useRef, useCallback } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { Crown, ExternalLink, Shield, Star, Trash2, Zap } from 'lucide-react'

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

const TIER_OPTIONS = [
  { value: 'free', label: 'Community (Free)', group: 'GA Plans' },
  { value: 'pro', label: 'Pro ($30/mo)', group: 'GA Plans' },
  { value: 'team', label: 'Studio ($60/mo)', group: 'GA Plans' },
  { value: 'enterprise', label: 'Enterprise', group: 'GA Plans' },
  { value: 'access', label: 'Founding Access ($15)', group: 'Founding' },
  { value: 'founding-pro-early', label: 'Founding Pro · Early Bird ($50)', group: 'Founding' },
  { value: 'founding-pro', label: 'Founding Pro ($100)', group: 'Founding' },
  { value: 'founding-studio', label: 'Founding Studio ($250)', group: 'Founding' },
  { value: 'founding-studio-plus', label: 'Founding Partner ($600)', group: 'Founding' },
]

const TIER_BADGES: Record<string, { color: string; icon: typeof Crown }> = {
  free: { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: Star },
  access: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Star },
  'founding-pro-early': { color: 'bg-brand-500/20 text-brand-400 border-brand-500/30', icon: Zap },
  'founding-pro': { color: 'bg-brand-500/20 text-brand-300 border-brand-500/30', icon: Zap },
  'founding-studio': { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: Crown },
  'founding-studio-plus': { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Crown },
  pro: { color: 'bg-brand-500/20 text-brand-400 border-brand-500/30', icon: Zap },
  team: { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: Crown },
  enterprise: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Shield },
}

const TIER_NAMES: Record<string, string> = {
  free: 'Community',
  access: 'Founding Access',
  'founding-pro-early': 'Founding Pro · Early Bird',
  'founding-pro': 'Founding Pro',
  'founding-studio': 'Founding Studio',
  'founding-studio-plus': 'Founding Partner',
  pro: 'Pro',
  team: 'Studio',
  enterprise: 'Enterprise',
}

const STATUS_BADGES: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  trial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  past_due: 'bg-red-500/20 text-red-400 border-red-500/30',
  canceled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

function TierBadge({ tier }: { tier: string }) {
  const { color, icon: Icon } = TIER_BADGES[tier] || TIER_BADGES.free
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${color}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {TIER_NAMES[tier] || tier}
    </span>
  )
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatRelative(d: string | null) {
  if (!d) return '—'
  const now = new Date()
  const date = new Date(d)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return formatDate(d)
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
  const [viewingUser, setViewingUser] = useState<User | null>(null)

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
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">{total.toLocaleString()} total users</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by email or name..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:border-brand-500 outline-none text-sm"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-colors"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">User</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Tier</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Status</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Messages</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Last Active</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Created</th>
                <th className="text-right px-4 py-3 font-medium text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-[var(--text-muted)]">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-[var(--text-muted)]">No users found</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer" onClick={() => setViewingUser(user)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
                          {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[var(--text)] text-sm font-medium">{user.displayName || '—'}</p>
                          <p className="text-[var(--text-dim)] text-xs">{user.email}</p>
                        </div>
                        {user.isAdmin && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">Admin</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3"><TierBadge tier={user.tier} /></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${STATUS_BADGES[user.subscriptionStatus] || STATUS_BADGES.inactive}`}>
                        {user.subscriptionStatus || 'inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{user.messageCount?.toLocaleString() || '0'}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{formatRelative(user.lastActive)}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setChangingTier(user.id); setNewTier(user.tier || 'free') }}
                          className="px-2 py-1 rounded text-xs bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors"
                        >
                          Tier
                        </button>
                        <button
                          onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            user.isAdmin ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                          }`}
                        >
                          {user.isAdmin ? 'Unadmin' : 'Admin'}
                        </button>
                        <button
                          onClick={() => setDeleting(user.id)}
                          className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-dim)]">Page {page} of {pages} · {total.toLocaleString()} users</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors">← Prev</button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* User detail drawer */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setViewingUser(null)}>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button onClick={() => setViewingUser(null)} className="text-[var(--text-muted)] hover:text-[var(--text)]">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-lg font-bold text-brand-400">
                  {viewingUser.displayName?.[0]?.toUpperCase() || viewingUser.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-[var(--text)]">{viewingUser.displayName || 'No name'}</p>
                  <p className="text-sm text-[var(--text-muted)]">{viewingUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-[var(--text-dim)]">ID:</span> <span className="text-[var(--text)] font-mono text-xs">{viewingUser.id}</span></div>
                <div><span className="text-[var(--text-dim)]">Tier:</span> <TierBadge tier={viewingUser.tier} /></div>
                <div><span className="text-[var(--text-dim)]">Status:</span> <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${STATUS_BADGES[viewingUser.subscriptionStatus] || STATUS_BADGES.inactive}`}>{viewingUser.subscriptionStatus || 'inactive'}</span></div>
                <div><span className="text-[var(--text-dim)]">Admin:</span> <span className="text-[var(--text)]">{viewingUser.isAdmin ? 'Yes' : 'No'}</span></div>
                <div><span className="text-[var(--text-dim)]">Messages:</span> <span className="text-[var(--text)]">{viewingUser.messageCount?.toLocaleString() || '0'}</span></div>
                <div><span className="text-[var(--text-dim)]">Verified:</span> <span className="text-[var(--text)]">{viewingUser.emailVerified ? '✓' : '✗'}</span></div>
                <div><span className="text-[var(--text-dim)]">Created:</span> <span className="text-[var(--text)]">{formatDate(viewingUser.createdAt)}</span></div>
                <div><span className="text-[var(--text-dim)]">Last active:</span> <span className="text-[var(--text)]">{formatRelative(viewingUser.lastActive)}</span></div>
              </div>
              {viewingUser.stripeCustomerId && (
                <div className="flex items-center gap-2 text-sm pt-2 border-t border-[var(--border)]">
                  <ExternalLink className="w-4 h-4 text-[var(--text-dim)]" />
                  <span className="text-[var(--text-dim)]">Stripe:</span>
                  <span className="text-[var(--text)] font-mono text-xs">{viewingUser.stripeCustomerId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Change tier modal */}
      {changingTier && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setChangingTier(null)}>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Change User Tier</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Changing tier for: <strong className="text-[var(--text)]">{users.find(u => u.id === changingTier)?.email}</strong>
            </p>
            <select
              value={newTier}
              onChange={e => setNewTier(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none mb-2"
            >
              <optgroup label="GA Plans">
                <option value="free">Community (Free)</option>
                <option value="pro">Pro ($30/mo)</option>
                <option value="team">Studio ($60/mo)</option>
                <option value="enterprise">Enterprise</option>
              </optgroup>
              <optgroup label="Founding Packages">
                <option value="access">Founding Access ($15)</option>
                <option value="founding-pro-early">Founding Pro · Early Bird ($50)</option>
                <option value="founding-pro">Founding Pro ($100)</option>
                <option value="founding-studio">Founding Studio ($250)</option>
                <option value="founding-studio-plus">Founding Partner ($600)</option>
              </optgroup>
            </select>
            <p className="text-xs text-[var(--text-dim)] mb-4">
              {newTier.startsWith('founding-') || newTier === 'access'
                ? '⚡ Founding packages are one-time purchases with lifetime access.'
                : newTier === 'free'
                  ? '↓ Will cancel any existing subscription.'
                  : '🔄 Monthly subscription — sets 1-month billing period.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setChangingTier(null)} className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              <button onClick={() => handleTierChange(changingTier)} className="flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">Change tier</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleting && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setDeleting(null)}>
          <div className="bg-[var(--surface)] border border-red-500/30 rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2 text-red-400">Delete User</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Are you sure you want to permanently delete <strong className="text-[var(--text)]">{users.find(u => u.id === deleting)?.email}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleting)} className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">Delete user</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}