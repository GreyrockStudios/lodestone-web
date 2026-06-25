import { useState, useEffect, useCallback, useRef } from 'react'

interface AuditEntry {
  id: string
  tool: string
  risk_level: 'low' | 'medium' | 'high'
  args: Record<string, any>
  result?: any
  timestamp: string
  conversation_id?: string
  duration_ms?: number
}

interface AuditStats {
  total_today: number
  total_week: number
  most_used_tool: string | null
  by_risk: { low: number; medium: number; high: number }
}

const RISK_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Low' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Medium' },
  high: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'High' },
}

const TOOL_ICONS: Record<string, string> = {
  web_search: '🔍',
  web_fetch: '🌐',
  execute_code: '🐍',
  save_memory: '💾',
  search_memory: '🧠',
  file_read: '📄',
  file_write: '✏️',
  shell_exec: '💻',
  calculator: '🧮',
  weather: '🌤️',
  create_commitment: '📋',
  set_reminder: '⏰',
}

export default function AuditLogPanel() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // Filters
  const [filterTool, setFilterTool] = useState<string>('')
  const [filterRisk, setFilterRisk] = useState<string>('')
  const [filterDateFrom, setFilterDateFrom] = useState<string>('')
  const [filterDateTo, setFilterDateTo] = useState<string>('')

  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getToken = useCallback(() => localStorage.getItem('lodestone_access_token') || '', [])

  const buildQuery = useCallback((offset = 0) => {
    const params = new URLSearchParams()
    params.set('limit', '50')
    params.set('offset', String(offset))
    if (filterTool) params.set('tool', filterTool)
    if (filterRisk) params.set('risk_level', filterRisk)
    if (filterDateFrom) params.set('from', filterDateFrom)
    if (filterDateTo) params.set('to', filterDateTo)
    return params.toString()
  }, [filterTool, filterRisk, filterDateFrom, filterDateTo])

  const loadEntries = useCallback(async (append = false) => {
    const token = getToken()
    if (!token) { setLoading(false); return }

    if (!append) setLoading(true)
    else setLoadingMore(true)

    try {
      const offset = append ? entries.length : 0
      const res = await fetch(`/api/audit?${buildQuery(offset)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to load audit log')

      const data = await res.json()
      const newEntries: AuditEntry[] = Array.isArray(data.entries) ? data.entries : Array.isArray(data.logs) ? data.logs : Array.isArray(data) ? data : []

      if (append) {
        setEntries(prev => [...prev, ...newEntries])
      } else {
        setEntries(newEntries)
      }
      setHasMore(newEntries.length === 50)
      setError(null)

      // Load stats
      const statsRes = await fetch('/api/audit/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (statsRes.ok) {
        const rawData = await statsRes.json()
        const statsData = {
          total_today: rawData.today ?? rawData.total_today ?? 0,
          total_week: rawData.thisWeek ?? rawData.total_week ?? 0,
          most_used_tool: rawData.mostUsedTool ?? rawData.most_used_tool ?? null,
          by_risk: rawData.by_risk ?? (Array.isArray(rawData.riskCounts) ? rawData.riskCounts.reduce((acc: any, item: any) => { acc[item.risk_level] = Number(item.count); return acc }, { low: 0, medium: 0, high: 0 }) : { low: 0, medium: 0, high: 0 })
        }
        setStats(statsData)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load audit log')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [getToken, buildQuery, entries.length])

  useEffect(() => { loadEntries() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when filters change
  useEffect(() => {
    loadEntries()
  }, [filterTool, filterRisk, filterDateFrom, filterDateTo]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 30 seconds
  useEffect(() => {
    refreshTimerRef.current = setInterval(() => {
      loadEntries()
    }, 30000)
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current)
    }
  }, [loadEntries])

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }, [])

  // Derive unique tool names for filter dropdown
  const toolNames = [...new Set(entries.map(e => e.tool))].sort()

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = d.toDateString() === yesterday.toDateString()

    if (isToday) return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    if (isYesterday) return `Yesterday ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const summarizeArgs = (args: Record<string, any>): string => {
    if (!args || typeof args !== 'object') return ''
    const keys = Object.keys(args)
    if (keys.length === 0) return 'No arguments'
    const parts = keys.slice(0, 3).map(k => {
      const val = args[k]
      if (typeof val === 'string') return `${k}: "${val.length > 40 ? val.slice(0, 40) + '…' : val}"`
      if (typeof val === 'number') return `${k}: ${val}`
      if (typeof val === 'boolean') return `${k}: ${val}`
      return `${k}: …`
    })
    const suffix = keys.length > 3 ? ` +${keys.length - 3} more` : ''
    return parts.join(', ') + suffix
  }

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
        <button onClick={() => loadEntries()} className="px-3 py-1.5 rounded-lg bg-brand-500 text-white text-sm hover:bg-brand-600 transition-colors">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--text)]">{stats.total_today}</p>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">Calls Today</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[var(--text)]">{stats.total_week}</p>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">This Week</p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-[var(--text)] truncate">{stats.most_used_tool || '—'}</p>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">Most Used Tool</p>
          </div>
        </div>
      )}

      {/* Risk breakdown bar */}
      {stats && (stats.by_risk.low + stats.by_risk.medium + stats.by_risk.high > 0) && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3">
          <div className="flex items-center gap-3 text-xs text-[var(--text-dim)]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Low: {stats.by_risk.low}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Med: {stats.by_risk.medium}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> High: {stats.by_risk.high}</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-[var(--bg)] overflow-hidden flex">
            {stats.by_risk.low > 0 && <div className="bg-green-500 h-full" style={{ width: `${(stats.by_risk.low / (stats.by_risk.low + stats.by_risk.medium + stats.by_risk.high)) * 100}%` }} />}
            {stats.by_risk.medium > 0 && <div className="bg-yellow-500 h-full" style={{ width: `${(stats.by_risk.medium / (stats.by_risk.low + stats.by_risk.medium + stats.by_risk.high)) * 100}%` }} />}
            {stats.by_risk.high > 0 && <div className="bg-red-500 h-full" style={{ width: `${(stats.by_risk.high / (stats.by_risk.low + stats.by_risk.medium + stats.by_risk.high)) * 100}%` }} />}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterTool}
          onChange={e => setFilterTool(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
        >
          <option value="">All Tools</option>
          {toolNames.map(t => (
            <option key={t} value={t}>{TOOL_ICONS[t] || '🔧'} {t}</option>
          ))}
        </select>
        <select
          value={filterRisk}
          onChange={e => setFilterRisk(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
        >
          <option value="">All Risk Levels</option>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <input
          type="date"
          value={filterDateFrom}
          onChange={e => setFilterDateFrom(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
          placeholder="From"
        />
        <input
          type="date"
          value={filterDateTo}
          onChange={e => setFilterDateTo(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
          placeholder="To"
        />
        {(filterTool || filterRisk || filterDateFrom || filterDateTo) && (
          <button
            onClick={() => { setFilterTool(''); setFilterRisk(''); setFilterDateFrom(''); setFilterDateTo('') }}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Entry List */}
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl mb-3">📋</div>
          <p className="text-[var(--text-muted)]">No audit log entries</p>
          <p className="text-sm text-[var(--text-dim)] mt-1">Tool calls will appear here as they happen</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => {
            const risk = RISK_BADGE[entry.risk_level] || RISK_BADGE.low
            const isExpanded = expandedId === entry.id
            const icon = TOOL_ICONS[entry.tool] || '🔧'

            return (
              <div
                key={entry.id}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--brand)] transition-colors cursor-pointer"
                onClick={() => toggleExpand(entry.id)}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-base flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text)]">{entry.tool}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${risk.bg} ${risk.text}`}>
                        {risk.label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-dim)] mt-0.5 truncate">{summarizeArgs(entry.args)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[var(--text-dim)]">{formatTimestamp(entry.timestamp)}</p>
                    {entry.duration_ms != null && (
                      <p className="text-xs text-[var(--text-dim)]">{entry.duration_ms}ms</p>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-[var(--text-dim)] transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-3 border-t border-[var(--border)] pt-3 space-y-3" onClick={e => e.stopPropagation()}>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">Arguments</h4>
                      <pre className="p-3 rounded-lg bg-[var(--bg)] text-sm text-[var(--text-muted)] whitespace-pre-wrap overflow-auto max-h-48 border border-[var(--border)]">
                        {JSON.stringify(entry.args, null, 2)}
                      </pre>
                    </div>
                    {entry.result != null && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1">Result</h4>
                        <pre className="p-3 rounded-lg bg-[var(--bg)] text-sm text-[var(--text-muted)] whitespace-pre-wrap overflow-auto max-h-48 border border-[var(--border)]">
                          {typeof entry.result === 'string' ? entry.result : JSON.stringify(entry.result, null, 2)}
                        </pre>
                      </div>
                    )}
                    {entry.conversation_id && (
                      <a href={`/chat/${entry.conversation_id}`} className="text-xs text-[var(--cyan)] hover:underline">
                        View conversation →
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={() => loadEntries(true)}
            disabled={loadingMore}
            className="px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Auto-refresh indicator */}
      <p className="text-xs text-[var(--text-dim)] text-center">
        Auto-refreshes every 30s
      </p>
    </div>
  )
}