import { useEffect, useState, useRef, useCallback } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { ChevronLeft, ChevronRight, Copy, Plus, X } from 'lucide-react'

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

const TIER_LABELS: Record<string, string> = {
  access: 'Founding Access',
  'founding-pro-early': 'Founding Pro · Early Bird',
  'founding-pro': 'Founding Pro',
  'founding-studio': 'Founding Studio',
  'founding-studio-plus': 'Founding Partner',
  pro: 'Pro',
  team: 'Studio',
  enterprise: 'Enterprise',
  free: 'Community',
  desktop: 'Desktop',
}

const TYPE_STYLES: Record<string, string> = {
  trial: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  discount: 'bg-green-500/10 text-green-400 border-green-500/20',
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  used: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  revoked: 'bg-red-500/10 text-red-400 border-red-500/20',
  expired: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
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

  // Create form
  const [showCreate, setShowCreate] = useState(false)
  const [createCount, setCreateCount] = useState(1)
  const [createType, setCreateType] = useState<'trial' | 'discount'>('trial')
  const [createTier, setCreateTier] = useState('pro')
  const [createDuration, setCreateDuration] = useState(14)
  const [creating, setCreating] = useState(false)
  const [createdCodes, setCreatedCodes] = useState<string[]>([])

  // Revoke
  const [revoking, setRevoking] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const loadCodes = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchRef.current<{ codes: PromoCode[]; total: number; pages: number }>(`/promo?page=${pageNum}&limit=20`)
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
      const data = await adminFetchRef.current<{ codes: string[] }>('/promo', {
        method: 'POST',
        body: JSON.stringify({
          count: createCount,
          type: createType,
          tier_id: createTier,
          duration_days: createDuration,
        }),
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

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(createdCodes.join('\n'))
    setCopied('__all__')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promo Codes</h1>
          <p className="text-[var(--text-dim)] text-sm mt-0.5">{total.toLocaleString()} codes</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreatedCodes([]) }}
          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>

      {/* Created codes banner */}
      {createdCodes.length > 0 && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-green-400 font-medium text-sm">
              {createdCodes.length} code{createdCodes.length > 1 ? 's' : ''} created
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={copyAll}
                className="px-3 py-1 rounded-lg text-xs bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied === '__all__' ? 'Copied!' : 'Copy all'}
              </button>
              <button
                onClick={() => setCreatedCodes([])}
                className="p-1 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-[var(--bg)] rounded-lg p-3 font-mono text-sm text-[var(--text)] max-h-32 overflow-y-auto space-y-1">
            {createdCodes.map((code, i) => (
              <div key={i} className="flex items-center justify-between group">
                <span>{code}</span>
                <button
                  onClick={() => copyCode(code)}
                  className="text-[var(--text-dim)] hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  {copied === code ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Code list */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-16 text-[var(--text-dim)]">Loading...</div>
        ) : codes.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-dim)]">
            <p className="text-lg mb-1">No promo codes yet</p>
            <p className="text-sm">Create one to get started.</p>
          </div>
        ) : (
          codes.map(code => (
            <div key={code.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border)]/60 transition-all">
              {/* Code */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-sm text-[var(--text)]">{code.code}</span>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_STYLES[code.status] || STATUS_STYLES.active}`}>
                    {code.status}
                  </span>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${TYPE_STYLES[code.type] || ''}`}>
                    {code.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-dim)]">
                  <span>{TIER_LABELS[code.tier] || code.tier}</span>
                  {code.type === 'trial' && <span>{code.durationDays}d trial</span>}
                  <span>{new Date(code.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex items-center gap-1">
                <button
                  onClick={() => copyCode(code.code)}
                  className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                  title="Copy code"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {code.status === 'active' && (
                  <button
                    onClick={() => setRevoking(code.id)}
                    className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Revoke"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-xs text-[var(--text-dim)]">
            {total.toLocaleString()} codes · page {page} of {pages}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors inline-flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" /> Prev
            </button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors inline-flex items-center gap-1">
              Next <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-5">Create promo codes</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider mb-1.5">Count</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={createCount}
                  onChange={e => setCreateCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider mb-1.5">Type</label>
                <div className="flex gap-2">
                  {(['trial', 'discount'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setCreateType(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        createType === t
                          ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                          : 'bg-[var(--bg)] text-[var(--text-dim)] border border-[var(--border)] hover:border-[var(--border)]'
                      }`}
                    >
                      {t === 'trial' ? 'Trial' : 'Discount'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider mb-1.5">Tier</label>
                <select
                  value={createTier}
                  onChange={e => setCreateTier(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500/50"
                >
                  <optgroup label="Founding">
                    <option value="access">Founding Access</option>
                    <option value="founding-pro-early">Founding Pro · Early Bird</option>
                    <option value="founding-pro">Founding Pro</option>
                    <option value="founding-studio">Founding Studio</option>
                    <option value="founding-studio-plus">Founding Partner</option>
                  </optgroup>
                  <optgroup label="GA">
                    <option value="pro">Pro</option>
                    <option value="team">Studio</option>
                    <option value="enterprise">Enterprise</option>
                  </optgroup>
                </select>
              </div>

              {createType === 'trial' && (
                <div>
                  <label className="block text-xs font-medium text-[var(--text-dim)] uppercase tracking-wider mb-1.5">Trial days</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={createDuration}
                    onChange={e => setCreateDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500/50"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-dim)] text-sm hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={creating} className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-50">
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke modal */}
      {revoking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setRevoking(null)}>
          <div className="bg-[var(--surface)] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-red-400 mb-1">Revoke code</h3>
            <p className="text-sm text-[var(--text-dim)] mb-5">This code will no longer be redeemable.</p>
            <div className="flex gap-2">
              <button onClick={() => setRevoking(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-dim)] text-sm hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              <button onClick={() => handleRevoke(revoking)} className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">Revoke</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}