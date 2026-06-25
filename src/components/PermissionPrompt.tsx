import { useState, useEffect, useCallback } from 'react'

interface PermissionPromptProps {
  tool: string
  args: Record<string, any>
  riskLevel: 'low' | 'medium' | 'high'
  onAllow: () => void
  onDeny: () => void
  visible: boolean
}

const RISK_CONFIG: Record<string, { bg: string; border: string; text: string; glow: string; label: string }> = {
  low: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'shadow-green-500/20',
    label: 'Low Risk'
  },
  medium: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/20',
    label: 'Medium Risk'
  },
  high: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: 'shadow-red-500/20',
    label: 'High Risk'
  }
}

const TOOL_DESCRIPTIONS: Record<string, string> = {
  web_search: 'Search the web for information',
  web_fetch: 'Fetch and read content from a URL',
  execute_code: 'Execute code on your device',
  shell_exec: 'Run a shell command on your device',
  file_read: 'Read a file from your device',
  file_write: 'Write or modify a file on your device',
  save_memory: 'Save information to memory',
  search_memory: 'Search through stored memories',
  calculator: 'Perform a calculation',
  weather: 'Check weather information',
  create_commitment: 'Create a new commitment or task',
  set_reminder: 'Set a reminder or alarm',
  delete_file: 'Delete a file from your device',
  send_email: 'Send an email on your behalf',
  make_call: 'Make a phone call',
  browser_automation: 'Control the web browser',
}

function getToolDescription(tool: string): string {
  return TOOL_DESCRIPTIONS[tool] || `Execute the "${tool}" tool`
}

function formatArgPreview(args: Record<string, any>): string {
  if (!args || typeof args !== 'object') return ''
  const entries = Object.entries(args)
  if (entries.length === 0) return 'No arguments'

  return entries.slice(0, 4).map(([key, val]) => {
    if (typeof val === 'string') {
      const truncated = val.length > 60 ? val.slice(0, 57) + '...' : val
      return `${key}: "${truncated}"`
    }
    if (typeof val === 'number' || typeof val === 'boolean') return `${key}: ${val}`
    if (Array.isArray(val)) return `${key}: [${val.length} items]`
    if (typeof val === 'object' && val !== null) return `${key}: {...}`
    return `${key}: ${String(val)}`
  }).join('\n') + (entries.length > 4 ? `\n... +${entries.length - 4} more` : '')
}

export default function PermissionPrompt({ tool, args, riskLevel, onAllow, onDeny, visible }: PermissionPromptProps) {
  const [rememberTool, setRememberTool] = useState(false)
  const [autoApproveLow, setAutoApproveLow] = useState(() => {
    return localStorage.getItem('lodestone_auto_approve_low') === 'true'
  })
  const [animateIn, setAnimateIn] = useState(false)

  // Animate in when becoming visible
  useEffect(() => {
    if (visible) {
      // Reset state when new prompt appears
      setRememberTool(false)
      // Small delay for CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true)
        })
      })
    } else {
      setAnimateIn(false)
    }
  }, [visible, tool]) // Re-animate on tool change too

  const handleAllow = useCallback(() => {
    if (rememberTool) {
      const remembered = JSON.parse(localStorage.getItem('lodestone_approved_tools') || '[]')
      if (!remembered.includes(tool)) {
        remembered.push(tool)
        localStorage.setItem('lodestone_approved_tools', JSON.stringify(remembered))
      }
    }
    if (autoApproveLow) {
      localStorage.setItem('lodestone_auto_approve_low', 'true')
    } else {
      localStorage.removeItem('lodestone_auto_approve_low')
    }
    setAnimateIn(false)
    onAllow()
  }, [rememberTool, autoApproveLow, tool, onAllow])

  const handleDeny = useCallback(() => {
    setAnimateIn(false)
    onDeny()
  }, [onDeny])

  const handleAutoApproveChange = useCallback((checked: boolean) => {
    setAutoApproveLow(checked)
    if (checked) {
      localStorage.setItem('lodestone_auto_approve_low', 'true')
    } else {
      localStorage.removeItem('lodestone_auto_approve_low')
    }
  }, [])

  if (!visible) return null

  const risk = RISK_CONFIG[riskLevel] || RISK_CONFIG.low

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ opacity: animateIn ? 1 : 0, transition: 'opacity 200ms ease-out' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={handleDeny}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
        style={{
          transform: animateIn ? 'scale(1)' : 'scale(0.95)',
          opacity: animateIn ? 1 : 0,
          transition: 'transform 200ms ease-out, opacity 200ms ease-out'
        }}
      >
        {/* Risk level banner */}
        <div className={`px-5 py-2.5 ${risk.bg} ${risk.border} border-b flex items-center gap-2`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={risk.text}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className={`text-sm font-medium ${risk.text}`}>{risk.label}</span>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Tool name and description */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-[var(--text)]">{tool}</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">{getToolDescription(tool)}</p>
          </div>

          {/* Args preview */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">Arguments</h4>
            <pre className="p-3 rounded-lg bg-[var(--bg)] text-sm text-[var(--text-muted)] whitespace-pre-wrap border border-[var(--border)] max-h-32 overflow-auto">
              {formatArgPreview(args)}
            </pre>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberTool}
                onChange={e => setRememberTool(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg)] text-brand-500 focus:ring-brand-500 focus:ring-offset-0 accent-brand-500"
              />
              <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
                Remember for this tool
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={autoApproveLow}
                onChange={e => handleAutoApproveChange(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg)] text-brand-500 focus:ring-brand-500 focus:ring-offset-0 accent-brand-500"
              />
              <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
                Auto-approve low-risk actions
              </span>
            </label>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={handleDeny}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] text-sm font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
          >
            Deny
          </button>
          <button
            onClick={handleAllow}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors shadow-lg ${
              riskLevel === 'high'
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25'
                : riskLevel === 'medium'
                  ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/25'
                  : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/25'
            }`}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  )
}