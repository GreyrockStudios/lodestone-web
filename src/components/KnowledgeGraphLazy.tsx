import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const KnowledgeGraph = lazy(() => import('./KnowledgeGraph'))

interface GraphProps {
  className?: string
  interactive?: boolean
  starCount?: number
  dustCount?: number
  background?: number
}

/**
 * Loading placeholder that mimics the final graph's dark canvas and centre
 * glow, so the section never looks broken or empty while three.js downloads.
 */
function GraphSkeleton() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a16 0%, #050510 70%)' }}
      aria-hidden="true"
    >
      <div
        className="absolute w-56 h-56 rounded-full blur-3xl animate-pulse"
        style={{
          background:
            'radial-gradient(circle, rgba(139,92,246,0.35), rgba(96,165,250,0.18) 45%, transparent 70%)',
        }}
      />
      <div className="relative w-7 h-7 rounded-full border-2 border-brand-500/60 border-t-transparent animate-spin" />
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-[var(--text-dim)] whitespace-nowrap">
        Loading knowledge graph…
      </div>
    </div>
  )
}

/**
 * Lazy-loads the heavy three.js KnowledgeGraph. The bundle is only fetched once
 * the container scrolls near the viewport, and a skeleton fills the exact box
 * until the scene is ready.
 */
export default function KnowledgeGraphLazy({ className = '', ...props }: GraphProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '250px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {inView ? (
        <Suspense fallback={<GraphSkeleton />}>
          <KnowledgeGraph {...props} />
        </Suspense>
      ) : (
        <GraphSkeleton />
      )}
    </div>
  )
}
