/**
 * Lightweight graph metadata + legend. Kept free of three.js so it can be
 * imported without pulling the heavy 3D bundle (which is lazy-loaded).
 */
export const GRAPH_CATEGORIES = [
  { key: 'fact', label: 'Facts', color: '#60A5FA' },
  { key: 'preference', label: 'Preferences', color: '#34D399' },
  { key: 'instruction', label: 'Instructions', color: '#FBBF24' },
  { key: 'note', label: 'Notes', color: '#A78BFA' },
  { key: 'entity', label: 'Entities', color: '#F472B6' },
  { key: 'decision', label: 'Decisions', color: '#FB923C' },
  { key: 'project', label: 'Projects', color: '#FCD34D' },
] as const

export function GraphLegend({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 ${className}`}>
      {GRAPH_CATEGORIES.map((c) => (
        <span key={c.key} className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
          {c.label}
        </span>
      ))}
    </div>
  )
}
