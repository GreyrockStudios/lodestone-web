import { useState, useCallback } from 'react'
import Markdown from './Markdown'

interface ModelCompareProps {
  leftResponse: string
  rightResponse: string
  leftModel: string
  rightModel: string
}

export default function ModelCompare({ leftResponse, rightResponse, leftModel, rightModel }: ModelCompareProps) {
  const [swapped, setSwapped] = useState(false)
  const [copiedSide, setCopiedSide] = useState<'left' | 'right' | null>(null)

  const left = swapped ? rightResponse : leftResponse
  const right = swapped ? leftResponse : rightResponse
  const leftLabel = swapped ? rightModel : leftModel
  const rightLabel = swapped ? leftModel : rightModel

  const handleCopy = useCallback(async (side: 'left' | 'right', text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSide(side)
      setTimeout(() => setCopiedSide(null), 2000)
    } catch {}
  }, [])

  const handleSwap = useCallback(() => {
    setSwapped(prev => !prev)
  }, [])

  return (
    <div className="flex flex-col md:flex-row w-full gap-0 md:gap-0 rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border)] md:absolute md:top-0 md:left-0 md:right-0 md:z-10">
        <span className="text-xs text-[var(--text-dim)] font-medium">Model Comparison</span>
        <button
          onClick={handleSwap}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
          title="Swap sides"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
          Swap
        </button>
      </div>

      {/* Left pane */}
      <div className="flex-1 min-w-0 border-b md:border-b-0 md:border-r border-[var(--border)]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)]">
          <span className="text-sm font-medium text-[var(--text)]">{leftLabel}</span>
          <button
            onClick={() => handleCopy('left', left)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            title="Copy response"
          >
            {copiedSide === 'left' ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[600px] bg-[var(--bg)]">
          <Markdown content={left} />
        </div>
      </div>

      {/* Divider (desktop) */}
      {/* Handled via border-r on left pane */}

      {/* Right pane */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)]">
          <span className="text-sm font-medium text-[var(--text)]">{rightLabel}</span>
          <button
            onClick={() => handleCopy('right', right)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            title="Copy response"
          >
            {copiedSide === 'right' ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[600px] bg-[var(--bg)]">
          <Markdown content={right} />
        </div>
      </div>
    </div>
  )
}
