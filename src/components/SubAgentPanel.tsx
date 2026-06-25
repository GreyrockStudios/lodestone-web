import { useState, useEffect, useCallback } from 'react'

interface SubAgentTask {
  id: string
  title: string
  prompt: string
  model: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result: string | null
  error: string | null
  created_at: string
  started_at?: string | null
  completed_at?: string | null
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: '⏳' },
  running: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: '⚡' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: '✓' },
  failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: '✗' },
}

const MODELS = [
  { id: 'glm-5.1:cloud', label: 'GLM 5.1 Cloud' },
  { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
  { id: 'gpt-4o', label: 'GPT-4o' },
  { id: 'o3', label: 'O3' },
]

export default function SubAgentPanel() {
  const [tasks, setTasks] = useState<SubAgentTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formPrompt, setFormPrompt] = useState('')
  const [formModel, setFormModel] = useState(MODELS[0].id)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const getToken = useCallback(() => localStorage.getItem('lodestone_access_token') || '', [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const loadTasks = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch('/api/sub-agents', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || data.sub_agents || data || [])
        setError(null)
      } else {
        setError('Failed to load tasks')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => { loadTasks() }, [loadTasks])

  // Auto-refresh every 10s when running tasks exist
  useEffect(() => {
    const hasRunning = tasks.some(t => t.status === 'running')
    if (!hasRunning) return
    const interval = setInterval(loadTasks, 10000)
    return () => clearInterval(interval)
  }, [tasks, loadTasks])

  const createTask = useCallback(async () => {
    if (!formTitle.trim() || !formPrompt.trim()) return
    const token = getToken()
    setSubmitting(true)
    try {
      const res = await fetch('/api/sub-agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: formTitle, prompt: formPrompt, model: formModel })
      })
      if (res.ok) {
        setShowForm(false)
        setFormTitle('')
        setFormPrompt('')
        setFormModel(MODELS[0].id)
        showToast('Task created')
        loadTasks()
      } else {
        showToast('Failed to create task')
      }
    } catch {
      showToast('Network error')
    } finally {
      setSubmitting(false)
    }
  }, [formTitle, formPrompt, formModel, getToken, loadTasks, showToast])

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-2">{error}</p>
        <button onClick={loadTasks} className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600 transition-colors">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text)]">Background Tasks</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* New Task Form */}
      {showForm && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 animate-fade-in">
          <h3 className="text-sm font-medium text-[var(--text)] mb-3">New Sub-Agent Task</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g., Research competitive landscape"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Prompt</label>
              <textarea
                value={formPrompt}
                onChange={e => setFormPrompt(e.target.value)}
                placeholder="Describe what the sub-agent should do..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 resize-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Model</label>
              <select
                value={formModel}
                onChange={e => setFormModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowForm(false); setFormTitle(''); setFormPrompt(''); setFormModel(MODELS[0].id) }}
                className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                disabled={submitting || !formTitle.trim() || !formPrompt.trim()}
                className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl mb-3">⚡</div>
          <p className="text-[var(--text-muted)]">No background tasks yet</p>
          <p className="text-sm text-[var(--text-dim)] mt-1">Create a task to have a sub-agent work in the background</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => {
            const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending
            const isExpanded = expandedId === task.id

            return (
              <div
                key={task.id}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden transition-colors hover:border-[var(--border)]"
              >
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  onClick={() => task.status === 'completed' || task.status === 'failed' ? toggleExpand(task.id) : undefined}
                >
                  <span className="text-base flex-shrink-0">{statusCfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-[var(--text)] truncate">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[var(--text-dim)]">{task.model}</span>
                      <span className="text-xs text-[var(--text-dim)]">·</span>
                      <span className="text-xs text-[var(--text-dim)]">{new Date(task.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  {(task.status === 'completed' || task.status === 'failed') && (
                    <svg
                      className={`w-4 h-4 text-[var(--text-dim)] transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                  {task.status === 'running' && (
                    <div className="animate-spin w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full flex-shrink-0" />
                  )}
                </div>

                {/* Expanded result */}
                {isExpanded && (task.result || task.error) && (
                  <div className="px-4 pb-3 border-t border-[var(--border)] pt-3">
                    {task.error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {task.error}
                      </div>
                    )}
                    {task.result && (
                      <pre className="p-3 rounded-lg bg-[var(--bg)] text-sm text-[var(--text-muted)] whitespace-pre-wrap overflow-auto max-h-64 border border-[var(--border)]">
                        {task.result}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}
