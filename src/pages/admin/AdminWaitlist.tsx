import { useEffect, useState, useRef, useCallback } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { ChevronLeft, ChevronRight, Trash2, Users } from 'lucide-react'

interface WaitlistEntry {
  id: string
  email: string
  createdAt: string
}

export default function AdminWaitlist() {
  const { adminFetch } = useAdmin()
  const adminFetchRef = useRef(adminFetch)
  adminFetchRef.current = adminFetch

  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [deleting, setDeleting] = useState<string | null>(null)

  const loadEntries = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: '50' })
      const data = await adminFetchRef.current<{ entries: WaitlistEntry[]; total: number; pages: number }>(`/waitlist?${params}`)
      setEntries(data.entries)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEntries(page)
  }, [page, loadEntries])

  const handleDelete = async (id: string) => {
    try {
      await adminFetchRef.current(`/waitlist/${id}`, { method: 'DELETE' })
      setDeleting(null)
      loadEntries(page)
    } catch (err: any) {
      alert('Failed to remove: ' + err.message)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waitlist</h1>
          <p className="text-[var(--text-dim)] text-sm mt-0.5">{total.toLocaleString()} signups</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        {loading ? (
          <div className="text-center py-16 text-[var(--text-dim)]">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-dim)]">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-lg mb-1">No waitlist entries</p>
            <p className="text-sm">Signups will appear here.</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border)]/60 transition-all group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/15 to-cyan-500/10 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0">
                {entry.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text)] truncate">{entry.email}</p>
                <p className="text-xs text-[var(--text-dim)]">
                  {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setDeleting(entry.id)}
                className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-xs text-[var(--text-dim)]">{total.toLocaleString()} entries · page {page} of {pages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors inline-flex items-center gap-1"><ChevronLeft className="w-3 h-3" /> Prev</button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--surface-2)] disabled:opacity-30 transition-colors inline-flex items-center gap-1">Next <ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleting(null)}>
          <div className="bg-[var(--surface)] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-red-400 mb-1">Remove from waitlist</h3>
            <p className="text-sm text-[var(--text-dim)] mb-5">
              Remove <strong className="text-[var(--text)]">{entries.find(e => e.id === deleting)?.email}</strong>?
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleting(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-dim)] text-sm hover:bg-[var(--surface-2)] transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleting)} className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}