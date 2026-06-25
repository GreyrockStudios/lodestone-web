import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'

interface Commitment {
  id: string
  content: string
  due_date: string | null
  status: string
  created_at: string
}

export default function CommitmentsPanel() {
  const { accessToken } = useAuth()
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [loading, setLoading] = useState(true)

  const getToken = useCallback(() => accessToken || localStorage.getItem('lodestone_access_token'), [accessToken])

  const loadCommitments = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch('/api/chat/commitments?status=pending', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setCommitments(data.commitments || [])
      }
    } catch {} finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { loadCommitments() }, [loadCommitments])

  const markDone = async (id: string) => {
    const token = getToken()
    if (!token) return
    await fetch(`/api/chat/commitments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'done' })
    })
    loadCommitments()
    window.dispatchEvent(new CustomEvent('conversations-changed'))
  }

  const deleteCommitment = async (id: string) => {
    const token = getToken()
    if (!token) return
    await fetch(`/api/chat/commitments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    loadCommitments()
    window.dispatchEvent(new CustomEvent('conversations-changed'))
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text)]">Pending Tasks</h2>
        <span className="text-xs text-[var(--text-dim)]">{commitments.length} pending</span>
      </div>
      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      ) : commitments.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No pending tasks. Say "I need to..." in chat to create one.</p>
      ) : (
        <div className="space-y-2">
          {commitments.map(c => (
            <div key={c.id} className="flex items-start gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] group">
              <button
                onClick={() => markDone(c.id)}
                className="mt-0.5 w-4 h-4 rounded border border-[var(--border)] hover:border-green-500 hover:bg-green-500/10 flex-shrink-0 flex items-center justify-center transition-colors"
                title="Mark done"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text)]">{c.content}</p>
                {c.due_date && (
                  <p className="text-xs text-[var(--text-dim)] mt-0.5">
                    Due: {new Date(c.due_date).toLocaleDateString()}
                    {new Date(c.due_date) < new Date() && <span className="text-amber-400 ml-1">overdue</span>}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteCommitment(c.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-dim)] hover:text-red-400 transition-all"
                title="Remove"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
