import { useEffect, useState, useRef, useCallback } from 'react'
import { useAdmin } from '../../hooks/useAdmin'

interface User {
  id: string
  email: string
  displayName: string
  tier: string
  subscriptionStatus: string
  isAdmin: boolean
  createdAt: string
  lastLogin: string | null
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

  // Change tier modal
  const [changingTier, setChangingTier] = useState<string | null>(null)
  const [newTier, setNewTier] = useState('')

  // Delete confirmation
  const [deleting, setDeleting] = useState<string | null>(null)

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
      setNewTier('')
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

  const tierBadge: Record<string, string> = {
    free: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    desktop: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
    pro: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    enterprise: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  }

  const statusBadge: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    trial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    past_due: 'bg-red-500/20 text-red-400 border-red-500/30',
    canceled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
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
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Email</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Name</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Role</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Tier</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Status</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Created</th>
                <th className="text-right px-4 py-3 font-medium text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[var(--text-muted)]">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[var(--text-muted)]">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-4 py-3 text-[var(--text)]">{user.email}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{user.displayName || '—'}</td>
                    <td className="px-4 py-3">
                      {user.isAdmin ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium border bg-amber-500/20 text-amber-400 border-amber-500/30">
                          Admin
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${tierBadge[user.tier] || tierBadge.free}`}>
                        {user.tier || 'free'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${statusBadge[user.subscriptionStatus] || statusBadge.inactive}`}>
                        {user.subscriptionStatus || 'inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            user.isAdmin
                              ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                              : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                          }`}
                        >
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => { setChangingTier(user.id); setNewTier(user.tier || 'free') }}
                          className="px-2 py-1 rounded text-xs bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors"
                        >
                          Change tier
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
            <p className="text-xs text-[var(--text-dim)]">
              Page {page} of {pages} · {total.toLocaleString()} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

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
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none mb-4"
            >
              <option value="free">Free</option>
              <option value="desktop">Desktop</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setChangingTier(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTierChange(changingTier)}
                className="flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
              >
                Change tier
              </button>
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
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleting)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Delete user
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
