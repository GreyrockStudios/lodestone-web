import { useState, useEffect, useCallback } from 'react'

interface ScheduledTask {
  id: string
  name: string
  prompt: string
  schedule: string
  cron_expr: string | null
  model: string
  last_run: string | null
  next_run: string | null
  status: string
  last_result: string | null
  run_count: number
  created_at: string
}

const SCHEDULE_OPTIONS = [
  { value: 'hourly', label: 'Every hour', icon: '⏱️' },
  { value: 'daily', label: 'Daily at 8am', icon: '🌅' },
  { value: 'weekly', label: 'Weekly', icon: '📅' },
  { value: 'monthly', label: 'Monthly', icon: '🗓️' },
  { value: 'custom', label: 'Custom (cron)', icon: '⚡' },
]

const MODEL_OPTIONS = [
  { value: 'glm-5.1:cloud', label: 'GLM 5.1 Cloud' },
  { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
  { value: 'gpt-4o', label: 'GPT-4o' },
]

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
  paused: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Paused' },
  disabled: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Disabled' },
}

export default function ScheduledTasksPanel() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formPrompt, setFormPrompt] = useState('')
  const [formSchedule, setFormSchedule] = useState('daily')
  const [formModel, setFormModel] = useState('glm-5.1:cloud')
  const [submitting, setSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getToken = useCallback(() => localStorage.getItem('lodestone_access_token') || '', [])

  const loadTasks = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch('/api/scheduled-tasks', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      } else {
        setError('Failed to load tasks')
      }
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }, [getToken])

  useEffect(() => { loadTasks() }, [loadTasks])

  const createTask = async () => {
    if (!formName.trim() || !formPrompt.trim()) return
    setSubmitting(true)
    const token = getToken()
    try {
      const res = await fetch('/api/scheduled-tasks', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, prompt: formPrompt, schedule: formSchedule, model: formModel })
      })
      if (res.ok) {
        setFormName(''); setFormPrompt(''); setFormSchedule('daily'); setShowForm(false)
        loadTasks()
      }
    } finally { setSubmitting(false) }
  }

  const toggleTask = async (id: string, currentStatus: string) => {
    const token = getToken()
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    await fetch(`/api/scheduled-tasks/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    loadTasks()
  }

  const runTask = async (id: string) => {
    const token = getToken()
    await fetch(`/api/scheduled-tasks/${id}/run`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    loadTasks()
  }

  const deleteTask = async (id: string) => {
    const token = getToken()
    await fetch(`/api/scheduled-tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    loadTasks()
  }

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
  if (error) return <div className="text-red-400 text-sm p-4">{error}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-[var(--text)]">Scheduled Tasks</h3>
          <p className="text-xs text-[var(--text-dim)] mt-0.5">Automate recurring prompts on a schedule</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-colors"
        >
          + New Task
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-4 space-y-3">
          <input
            type="text"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            placeholder="Task name (e.g., Daily News Summary)"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand)]"
          />
          <textarea
            value={formPrompt}
            onChange={e => setFormPrompt(e.target.value)}
            placeholder="Prompt to run (e.g., Summarize today's top tech news)"
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--brand)] resize-none"
          />
          <div className="flex gap-2">
            <select
              value={formSchedule}
              onChange={e => setFormSchedule(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--brand)]"
            >
              {SCHEDULE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.icon} {o.label}</option>)}
            </select>
            <select
              value={formModel}
              onChange={e => setFormModel(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--brand)]"
            >
              {MODEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)]">Cancel</button>
            <button
              onClick={createTask}
              disabled={submitting || !formName.trim() || !formPrompt.trim()}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </div>
      )}

      {tasks.length === 0 && !showForm && (
        <div className="text-center py-8 text-[var(--text-dim)] text-sm">
          <div className="text-3xl mb-2">⏰</div>
          No scheduled tasks yet. Create one to automate recurring prompts.
        </div>
      )}

      <div className="space-y-2">
        {tasks.map(task => {
          const status = STATUS_STYLES[task.status] || STATUS_STYLES.disabled
          const isExpanded = expandedId === task.id
          return (
            <div key={task.id} className="bg-[var(--surface-2)] border border-[var(--border)] rounded-lg overflow-hidden">
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--surface)] transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : task.id)}
              >
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.text}`}>{status.label}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{task.name}</p>
                  <p className="text-xs text-[var(--text-dim)]">{SCHEDULE_OPTIONS.find(o => o.value === task.schedule)?.icon} {task.schedule} · {task.model} · Runs: {task.run_count}</p>
                </div>
                <div className="text-xs text-[var(--text-dim)]">
                  {task.next_run ? `Next: ${formatDate(task.next_run)}` : '—'}
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-[var(--text-dim)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              {isExpanded && (
                <div className="px-4 py-3 border-t border-[var(--border)] space-y-2">
                  <p className="text-sm text-[var(--text)]">{task.prompt}</p>
                  {task.last_result && (
                    <div className="bg-[var(--bg)] border border-[var(--border)] rounded p-2 text-xs text-[var(--text-muted)] max-h-32 overflow-y-auto">
                      {task.last_result}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                    <span>Last run: {formatDate(task.last_run)}</span>
                    <span>Created: {formatDate(task.created_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => runTask(task.id)} className="px-3 py-1 rounded text-xs bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 transition-colors">▶ Run now</button>
                    <button onClick={() => toggleTask(task.id, task.status)} className="px-3 py-1 rounded text-xs bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                      {task.status === 'active' ? '⏸ Pause' : '▶ Resume'}
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="px-3 py-1 rounded text-xs text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}