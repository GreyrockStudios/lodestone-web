import { useEffect, useState, useRef, useCallback } from 'react'
import { useAdmin } from '../../hooks/useAdmin'

interface PromoCode {
  id: string
  code: string
  type: 'trial' | 'discount'
  tier: string
  status: 'active' | 'used' | 'revoked' | 'expired'
  usedBy: string | null
  createdAt: string
  durationDays: number
  discountPercent?: number
}

export default function AdminPromo() {
  const { adminFetch } = useAdmin()
  const adminFetchRef = useRef(adminFetch)
  adminFetchRef.current = adminFetch

  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const limit = 20

  // Create form
  const [showCreate, setShowCreate] = useState(false)
  const [createCount, setCreateCount] = useState(1)
  const [createType, setCreateType] = useState<'trial' | 'discount'>('trial')
  const [createTier, setCreateTier] = useState('pro')
  const [createDuration, setCreateDuration] = useState(14)
  const [createDiscount, setCreateDiscount] = useState(50)
  const [creating, setCreating] = useState(false)
  const [createdCodes, setCreatedCodes] = useState<string[]>([])

  // Revoke confirmation
  const [revoking, setRevoking] = useState<string | null>(null)

  const loadCodes = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchRef.current<{ codes: PromoCode[]; total: number; pages: number }>(`/promo?page=${pageNum}&limit=${limit}`)
      setCodes(data.codes)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCodes(page)
  }, [page, loadCodes])

  const handleCreate = async () => {
    setCreating(true)
    setError('')
    try {
      const body: any = {
        count: createCount,
        type: createType,
        tier: createTier,
        durationDays: createDuration,
      }
      if (createType === 'discount') {
        body.discountPercent = createDiscount
      }
      const data = await adminFetchRef.current<{ codes: string[] }>('/promo', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      setCreatedCodes(data.codes)
      setShowCreate(false)
      loadCodes(page)
    } catch (err: any) {
      setError(err.message)
    }
    setCreating(false)
  }

  const handleRevoke = async (codeId: string) => {
    try {
      await adminFetchRef.current(`/promo/${codeId}/revoke`, { method: 'PATCH' })
      setRevoking(null)
      loadCodes(page)
    } catch (err: any) {
      alert('Failed to revoke: ' + err.message)
    }
  }

  const typeBadge: Record<string, string> = {
    trial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    discount: 'bg-green-500/20 text-green-400 border-green-500/30',
  }

  const statusBadge: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    used: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    revoked: 'bg-red-500/20 text-red-400 border-red-500/30',
    expired: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }

  const tierBadge: Record<string, string> = {
    free: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    desktop: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
    pro: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  }

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const copyCodes = () => {
    navigator.clipboard.writeText(createdCodes.join('\n'))
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Promo Codes</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">{total.toLocaleString()} codes total</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreatedCodes([]) }}
          className="px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-colors"
        >
          + Create codes
        </button>
      </div>

      {/* Newly created codes banner */}
      {createdCodes.length > 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-green-400 font-medium">Codes created successfully!</h3>
            <div className="flex gap-2">
              <button
                onClick={copyCodes}
                className="px-3 py-1 rounded text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
              >
                Copy all
              </button>
              <button
                onClick={() => setCreatedCodes([])}
                className="px-3 py-1 rounded text-xs bg-[var(--surface-2)] text-[var(--text-muted)] hover:bg-[var(--border)] transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
          <div className="bg-[var(--bg)] rounded-lg p-3 font-mono text-sm text-[var(--text)] max-h-40 overflow-y-auto">
            {createdCodes.map((code, i) => (
              <div key={i}>{code}</div>
            ))}
          </div>
        </div>
      )}

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
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Code</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Type</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Tier</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Status</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Used By</th>
                <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Created</th>
                <th className="text-right px-4 py-3 font-medium text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[var(--text-muted)]">Loading...</td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[var(--text-muted)]">No promo codes yet</td>
                </tr>
              ) : (
                codes.map(code => (
                  <tr key={code.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-sm text-[var(--text)]">{code.code}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${typeBadge[code.type]}`}>
                        {code.type}
                        {code.type === 'discount' && code.discountPercent ? ` ${code.discountPercent}%` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${tierBadge[code.tier] || tierBadge.free}`}>
                        {code.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${statusBadge[code.status] || statusBadge.active}`}>
                        {code.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{code.usedBy || '—'}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(code.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {code.status === 'active' && (
                        <button
                          onClick={() => setRevoking(code.id)}
                          className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
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
              Page {page} of {pages} · {total.toLocaleString()} codes
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

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Create Promo Codes</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Number of codes</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={createCount}
                  onChange={e => setCreateCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Type</label>
                <select
                  value={createType}
                  onChange={e => setCreateType(e.target.value as 'trial' | 'discount')}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none"
                >
                  <option value="trial">Trial</option>
                  <option value="discount">Discount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Tier</label>
                <select
                  value={createTier}
                  onChange={e => setCreateTier(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none"
                >
                  <option value="desktop">Desktop</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              {createType === 'trial' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Trial duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={createDuration}
                    onChange={e => setCreateDuration(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none"
                  />
                </div>
              )}

              {createType === 'discount' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Discount percentage</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={createDiscount}
                    onChange={e => setCreateDiscount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke confirmation modal */}
      {revoking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setRevoking(null)}>
          <div className="bg-[var(--surface)] border border-red-500/30 rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2 text-red-400">Revoke Promo Code</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Are you sure you want to revoke this code? It will no longer be redeemable.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setRevoking(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevoke(revoking)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
