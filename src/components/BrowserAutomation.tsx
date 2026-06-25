import { useState, useCallback } from 'react'

interface ActionStep {
  id: string
  type: 'click' | 'type' | 'scroll' | 'wait' | 'navigate'
  selector: string
  value: string
}

export default function BrowserAutomation() {
  const [url, setUrl] = useState('')
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [loading, setLoading] = useState<'screenshot' | 'extract' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [actions, setActions] = useState<ActionStep[]>([])
  const [newActionType, setNewActionType] = useState<ActionStep['type']>('click')
  const [newActionSelector, setNewActionSelector] = useState('')
  const [newActionValue, setNewActionValue] = useState('')
  const [actionResult, setActionResult] = useState<string | null>(null)
  const [actionRunning, setActionRunning] = useState(false)

  const getToken = useCallback(() => localStorage.getItem('lodestone_access_token') || '', [])

  const takeScreenshot = useCallback(async () => {
    if (!url.trim()) return
    setLoading('screenshot')
    setError(null)
    setExtractedText(null)
    const token = getToken()
    try {
      const res = await fetch('/api/browser/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.screenshot) {
          // screenshot could be base64 or a URL
          setScreenshotUrl(data.screenshot.startsWith('data:') ? data.screenshot : `data:image/png;base64,${data.screenshot}`)
        } else if (data.url) {
          setScreenshotUrl(data.url)
        } else {
          setError('No screenshot data returned')
        }
      } else {
        const data = await res.json().catch(() => ({}))
        if (data.error?.includes?.('playwright') || data.error?.includes?.('Playwright') || data.error?.includes?.('browser')) {
          setError('Playwright is not installed. Ask an admin to run: npx playwright install chromium')
        } else {
          setError(data.error || data.message || `Failed to take screenshot (${res.status})`)
        }
      }
    } catch (err) {
      setError('Network error — is the browser automation service running?')
    } finally {
      setLoading(null)
    }
  }, [url, getToken])

  const extractText = useCallback(async () => {
    if (!url.trim()) return
    setLoading('extract')
    setError(null)
    setScreenshotUrl(null)
    const token = getToken()
    try {
      const res = await fetch('/api/browser/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.text || data.content || data.markdown) {
          setExtractedText(data.text || data.content || data.markdown)
        } else if (data.error) {
          setError(data.error)
        } else {
          setExtractedText(JSON.stringify(data, null, 2))
        }
      } else {
        const data = await res.json().catch(() => ({}))
        if (data.error?.includes?.('playwright') || data.error?.includes?.('Playwright') || data.error?.includes?.('browser')) {
          setError('Playwright is not installed. Ask an admin to run: npx playwright install chromium')
        } else {
          setError(data.error || data.message || `Failed to extract text (${res.status})`)
        }
      }
    } catch {
      setError('Network error — is the browser automation service running?')
    } finally {
      setLoading(null)
    }
  }, [url, getToken])

  const addAction = useCallback(() => {
    if (!newActionSelector.trim()) return
    setActions(prev => [...prev, {
      id: crypto.randomUUID(),
      type: newActionType,
      selector: newActionSelector,
      value: newActionValue
    }])
    setNewActionSelector('')
    setNewActionValue('')
  }, [newActionType, newActionSelector, newActionValue])

  const removeAction = useCallback((id: string) => {
    setActions(prev => prev.filter(a => a.id !== id))
  }, [])

  const runActions = useCallback(async () => {
    if (!url.trim() || actions.length === 0) return
    setActionRunning(true)
    setActionResult(null)
    setError(null)
    const token = getToken()
    try {
      const res = await fetch('/api/browser/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ url, actions: actions.map(a => ({ type: a.type, selector: a.selector, value: a.value })) })
      })
      if (res.ok) {
        const data = await res.json()
        setActionResult(data.result || data.output || JSON.stringify(data, null, 2))
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Failed to run actions (${res.status})`)
      }
    } catch {
      setError('Network error — is the browser automation service running?')
    } finally {
      setActionRunning(false)
    }
  }, [url, actions, getToken])

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <button
          onClick={takeScreenshot}
          disabled={!!loading || !url.trim()}
          className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          {loading === 'screenshot' ? (
            <><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Capturing...</>
          ) : (
            <>📷 Screenshot</>
          )}
        </button>
        <button
          onClick={extractText}
          disabled={!!loading || !url.trim()}
          className="px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm font-medium hover:bg-[var(--surface)] disabled:opacity-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          {loading === 'extract' ? (
            <><div className="animate-spin w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full" /> Extracting...</>
          ) : (
            <>📄 Extract</>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <div className="flex items-start gap-2">
            <span>⚠️</span>
            <div>
              <p>{error}</p>
              {(error.includes('Playwright') || error.includes('playwright')) && (
                <p className="mt-1 text-xs text-red-400/70">
                  The browser automation service needs Playwright installed. Run: <code className="px-1 py-0.5 bg-red-500/10 rounded">npx playwright install chromium</code>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Result */}
      {screenshotUrl && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
            <span className="text-xs text-[var(--text-dim)] font-medium">Screenshot</span>
            <a
              href={screenshotUrl}
              download="screenshot.png"
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Download
            </a>
          </div>
          <div className="p-2">
            <img
              src={screenshotUrl}
              alt="Page screenshot"
              className="w-full rounded-lg border border-[var(--border)]"
            />
          </div>
        </div>
      )}

      {/* Extracted Text Result */}
      {extractedText && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
            <span className="text-xs text-[var(--text-dim)] font-medium">Extracted Text</span>
            <button
              onClick={() => navigator.clipboard.writeText(extractedText).catch(() => {})}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 text-sm text-[var(--text-muted)] whitespace-pre-wrap overflow-auto max-h-96">
            {extractedText}
          </pre>
        </div>
      )}

      {/* Actions Builder */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">Actions</h3>
          {actions.length > 0 && (
            <button
              onClick={runActions}
              disabled={actionRunning || !url.trim()}
              className="px-3 py-1 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
            >
              {actionRunning ? 'Running...' : '▶ Run All'}
            </button>
          )}
        </div>

        {/* Action list */}
        {actions.length > 0 && (
          <div className="space-y-2 mb-3">
            {actions.map((action, i) => (
              <div key={action.id} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-[var(--surface-2)] text-[var(--text-dim)]">{i + 1}</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-brand-500/20 text-brand-400">{action.type}</span>
                <code className="flex-1 text-xs text-[var(--text-muted)] truncate">{action.selector}</code>
                {action.value && <code className="text-xs text-[var(--text-dim)] truncate max-w-[120px]">{action.value}</code>}
                <button
                  onClick={() => removeAction(action.id)}
                  className="text-[var(--text-dim)] hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add action form */}
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs text-[var(--text-dim)] mb-1">Type</label>
            <select
              value={newActionType}
              onChange={e => setNewActionType(e.target.value as ActionStep['type'])}
              className="w-full px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
            >
              <option value="click">Click</option>
              <option value="type">Type</option>
              <option value="scroll">Scroll</option>
              <option value="wait">Wait</option>
              <option value="navigate">Navigate</option>
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs text-[var(--text-dim)] mb-1">Selector</label>
            <input
              type="text"
              value={newActionSelector}
              onChange={e => setNewActionSelector(e.target.value)}
              placeholder={newActionType === 'navigate' ? 'URL or path' : 'e.g., #submit-btn'}
              className="w-full px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          {(newActionType === 'type' || newActionType === 'scroll' || newActionType === 'navigate') && (
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-[var(--text-dim)] mb-1">Value</label>
              <input
                type="text"
                value={newActionValue}
                onChange={e => setNewActionValue(e.target.value)}
                placeholder={newActionType === 'type' ? 'Text to type' : newActionType === 'scroll' ? 'pixels or selector' : 'URL'}
                className="w-full px-2 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          )}
          <button
            onClick={addAction}
            disabled={!newActionSelector.trim()}
            className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] text-sm hover:text-[var(--text)] hover:bg-[var(--surface)] disabled:opacity-50 transition-colors"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Action Result */}
      {actionResult && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--border)]">
            <span className="text-xs text-[var(--text-dim)] font-medium">Action Result</span>
          </div>
          <pre className="p-4 text-sm text-[var(--text-muted)] whitespace-pre-wrap overflow-auto max-h-64">
            {actionResult}
          </pre>
        </div>
      )}

      {/* Help text when empty */}
      {!screenshotUrl && !extractedText && !error && (
        <div className="text-center py-8">
          <div className="text-3xl mb-3">🌐</div>
          <p className="text-[var(--text-muted)]">Enter a URL above to get started</p>
          <p className="text-sm text-[var(--text-dim)] mt-1">Take screenshots, extract text, or build action sequences</p>
        </div>
      )}
    </div>
  )
}
