import { useEffect, useRef, useState } from 'react'

interface MermaidDiagramProps {
  definition: string
}

export default function MermaidDiagram({ definition }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    
    async function renderDiagram() {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#6366f1',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#4f46e5',
            lineColor: '#94a3b8',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            background: '#0f172a',
            mainBkg: '#1e293b',
            nodeBorder: '#4f46e5',
            clusterBkg: '#1e293b',
            clusterBorder: '#4f46e5',
            titleColor: '#e2e8f0',
            edgeLabelBackground: '#1e293b',
          },
          fontFamily: 'Inter, system-ui, sans-serif',
          flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
          sequence: { useMaxWidth: true, actorMargin: 50, mirrorActors: false },
        })

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, definition)
        if (!cancelled) {
          setSvg(renderedSvg)
          setError(null)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to render diagram')
          console.error('[Mermaid] Render error:', err)
        }
      }
    }

    renderDiagram()
    return () => { cancelled = true }
  }, [definition])

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <div className="text-sm font-medium text-red-400 mb-1">Diagram Error</div>
        <div className="text-xs text-red-300">{error}</div>
        <pre className="mt-2 text-xs text-[var(--text-muted)] overflow-x-auto">{definition}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="my-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 flex items-center justify-center">
        <div className="text-sm text-[var(--text-muted)]">Rendering diagram...</div>
      </div>
    )
  }

  return (
    <div className="my-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--surface-2)] border-b border-[var(--border)]">
        <span className="text-xs text-[var(--text-dim)]">Mermaid Diagram</span>
        <button
          onClick={() => navigator.clipboard.writeText(definition)}
          className="text-xs text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
        >
          Copy Source
        </button>
      </div>
      <div 
        ref={containerRef}
        className="p-4 flex justify-center overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}