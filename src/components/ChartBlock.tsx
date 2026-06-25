import { useEffect, useRef, useState } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'

// Register all Chart.js components
ChartJS.register(...registerables)

interface ChartBlockProps {
  code: string
}

// Color palette for charts (matches brand colors)
const CHART_COLORS = [
  'rgba(99, 102, 241, 0.8)',   // brand-500 (indigo)
  'rgba(16, 185, 129, 0.8)',   // emerald
  'rgba(245, 158, 11, 0.8)',   // amber
  'rgba(239, 68, 68, 0.8)',    // red
  'rgba(59, 130, 246, 0.8)',   // blue
  'rgba(168, 85, 247, 0.8)',   // purple
  'rgba(236, 72, 153, 0.8)',   // pink
  'rgba(20, 184, 166, 0.8)',   // teal
  'rgba(251, 146, 60, 0.8)',  // orange
  'rgba(34, 197, 94, 0.8)',   // green
]

const CHART_BORDERS = CHART_COLORS.map(c => c.replace('0.8', '1'))

function parseChartConfig(code: string): { type: string; data: any; options?: any } | null {
  try {
    // Try to parse as JSON first
    const config = JSON.parse(code)
    
    // Support shorthand format: { labels, datasets, type? }
    if (config.labels && config.datasets) {
      const chartType = config.type || 'bar'
      const datasets = config.datasets.map((ds: any, i: number) => {
        if (typeof ds === 'object' && ds.data) {
          return {
            ...ds,
            backgroundColor: ds.backgroundColor || ds.data.map((_: any, j: number) => CHART_COLORS[j % CHART_COLORS.length]),
            borderColor: ds.borderColor || ds.data.map((_: any, j: number) => CHART_BORDERS[j % CHART_BORDERS.length]),
            borderWidth: ds.borderWidth || 1,
          }
        }
        return {
          label: `Dataset ${i + 1}`,
          data: ds,
          backgroundColor: CHART_COLORS.slice(0, (Array.isArray(ds) ? ds : [ds]).length),
          borderColor: CHART_BORDERS.slice(0, (Array.isArray(ds) ? ds : [ds]).length),
          borderWidth: 1,
        }
      })
      
      return {
        type: chartType,
        data: { labels: config.labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e2e8f0' } },
            title: config.title ? { display: true, text: config.title, color: '#e2e8f0' } : undefined,
          },
          scales: chartType !== 'pie' && chartType !== 'doughnut' && chartType !== 'polarArea' && chartType !== 'radar' ? {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
          } : undefined,
          ...config.options,
        },
      }
    }

    // Support full Chart.js config format
    if (config.type && config.data) {
      return config
    }

    return null
  } catch {
    return null
  }
}

export default function ChartBlock({ code }: ChartBlockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const config = parseChartConfig(code)
    if (!config) {
      setError('Invalid chart configuration. Provide JSON with { labels, datasets, type? }')
      return
    }

    if (!canvasRef.current) return

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    try {
      chartRef.current = new ChartJS(canvasRef.current, {
        type: config.type as any,
        data: config.data,
        options: config.options || {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e2e8f0' } },
          },
          scales: config.type !== 'pie' && config.type !== 'doughnut' ? {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
          } : undefined,
        },
      })
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to render chart')
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [code])

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <div className="text-sm font-medium text-red-400 mb-1">Chart Error</div>
        <div className="text-xs text-red-300">{error}</div>
        <details className="mt-2">
          <summary className="text-xs text-[var(--text-muted)] cursor-pointer">View source</summary>
          <pre className="mt-1 text-xs text-[var(--text-muted)] overflow-x-auto">{code}</pre>
        </details>
      </div>
    )
  }

  return (
    <div className="my-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)]">
        <span className="text-xs text-[var(--text-dim)]">📊 Chart</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
        >
          Copy Data
        </button>
      </div>
      <div className="p-4" style={{ minHeight: '250px' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}