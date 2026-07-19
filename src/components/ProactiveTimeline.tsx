import { CalendarClock, Check, Clock } from 'lucide-react'
import { AUTONOMY_EXAMPLES } from '../content/site'
import { Reveal } from './SiteUI'

/**
 * Presentational vertical day-timeline showing Lodestone running its own
 * scheduled jobs while you're away. No external deps — pure layout using the
 * shared marketing styles.
 */
export default function ProactiveTimeline({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* vertical spine */}
      <div
        className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-500/50 via-[var(--border)] to-transparent"
        aria-hidden="true"
      />
      <ul className="space-y-4">
        {AUTONOMY_EXAMPLES.map((job, i) => (
          <Reveal as="li" key={job.title} delay={i * 100} className="relative pl-12">
            <span className="absolute left-0 top-1 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/25 to-indigo-500/15 border border-brand-500/30 text-brand-300">
              <CalendarClock className="w-5 h-5" />
            </span>
            <div className="site-card site-card-hover p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                <h3 className="font-display font-semibold">{job.title}</h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                  <Clock className="w-3 h-3" />
                  {job.when}
                </span>
              </div>
              <p className="flex items-start gap-2 text-sm text-[var(--text-muted)] leading-relaxed">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{job.result}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}
