import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarClock,
  Check,
  Cpu,
  FolderOpen,
  Minus,
  Sparkles,
  Terminal,
  WifiOff,
} from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { Eyebrow, HeroBackdrop, Reveal, SectionHeading } from '../components/SiteUI'
import { BROWSER_CANT, COMPARISON_ROWS, OPENCLAW_ROWS, SITE, VS_COLUMNS, VS_ROWS } from '../content/site'

const browserCantIcons: Record<string, typeof Cpu> = {
  'Touch your files': FolderOpen,
  'Run local commands': Terminal,
  'Act on a schedule': CalendarClock,
  'Work offline & private': WifiOff,
}

function VsCell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-400 mx-auto" />
  if (value === false) return <Minus className="w-4 h-4 text-[var(--text-dim)] mx-auto" />
  return <span className="text-xs text-[var(--text-muted)]">{value}</span>
}

export default function Compare() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <HeroBackdrop aurora="brand" />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-14 text-center">
          <Eyebrow icon={<Sparkles className="w-3.5 h-3.5" />} className="mb-5">
            Lodestone vs browser &amp; chat AI
          </Eyebrow>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            An agent that <span className="text-gradient">acts</span> — not another chat tab
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            ChatGPT, Claude, and browser assistants are stuck inside a tab. Lodestone is a desktop
            agent that touches your real machine and keeps working on its own schedule.
          </p>
        </div>
      </section>

      {/* What a browser can't do */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              title={<>What a browser <span className="text-gradient">literally can&apos;t</span> do</>}
              subtitle="A browser tab is sandboxed by design. A desktop agent isn't."
              className="mb-12"
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BROWSER_CANT.map((item, i) => {
              const Icon = browserCantIcons[item.title] ?? Cpu
              return (
                <Reveal key={item.title} delay={(i % 4) * 80}>
                  <div className="site-card site-card-hover h-full p-6">
                    <div className="mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/10 border border-brand-500/25 text-brand-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold mb-1.5">{item.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Named comparison table */}
      <section className="py-16 md:py-20 border-y border-[var(--border)] bg-[var(--surface)]/30">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading title="How Lodestone compares" className="mb-8" />
          </Reveal>
          <Reveal delay={80}>
            <div className="overflow-x-auto rounded-2xl border border-[var(--border)] site-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-3.5 px-4 font-medium text-[var(--text-muted)]">Capability</th>
                    {VS_COLUMNS.map((col, i) => (
                      <th
                        key={col}
                        className={`text-center py-3.5 px-3 font-semibold ${
                          i === 0 ? 'text-brand-300 bg-brand-500/[0.07]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VS_ROWS.map((row) => (
                    <tr key={row.feature} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-3 px-4 text-[var(--text-muted)]">{row.feature}</td>
                      {row.values.map((v, i) => (
                        <td
                          key={i}
                          className={`py-3 px-3 text-center ${i === 0 ? 'bg-brand-500/[0.05]' : ''}`}
                        >
                          <VsCell value={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-4 text-xs text-[var(--text-dim)] text-center max-w-2xl mx-auto">
            Comparison reflects standard consumer offerings as of 2026 and focuses on desktop /
            autonomy capabilities. Product features evolve — check each vendor for the latest.
          </p>
        </div>
      </section>

      {/* Category comparison (Lodestone vs typical) */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              title="Agent vs. chatbot, at a glance"
              className="mb-8"
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] site-card">
              <div className="grid grid-cols-[1.1fr_1fr_1fr] text-sm">
                <div className="px-4 md:px-5 py-4 text-[var(--text-dim)] font-medium border-b border-[var(--border)]" />
                <div className="px-4 md:px-5 py-4 border-b border-[var(--border)] bg-brand-500/10">
                  <span className="font-display font-bold text-brand-200">Lodestone</span>
                </div>
                <div className="px-4 md:px-5 py-4 border-b border-[var(--border)] text-[var(--text-dim)] font-medium">
                  Browser &amp; chat AI
                </div>
                {COMPARISON_ROWS.map((row) => (
                  <div key={row.label} className="contents">
                    <div className="px-4 md:px-5 py-4 text-[var(--text-muted)] font-medium border-b border-[var(--border)] last:border-0">
                      {row.label}
                    </div>
                    <div className="px-4 md:px-5 py-4 border-b border-[var(--border)] bg-brand-500/[0.06] flex items-start gap-2 text-[var(--text)]">
                      <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{row.lodestone}</span>
                    </div>
                    <div className="px-4 md:px-5 py-4 border-b border-[var(--border)] flex items-start gap-2 text-[var(--text-dim)]">
                      <Minus className="w-4 h-4 shrink-0 mt-0.5 opacity-60" />
                      <span>{row.others}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Named comparison: Lodestone vs OpenClaw */}
      <section className="py-16 md:py-20 border-y border-[var(--border)] bg-[var(--surface)]/30">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Vs. self-hosted runtimes"
              eyebrowIcon={<Terminal className="w-3.5 h-3.5" />}
              title="Lodestone vs OpenClaw"
              subtitle="OpenClaw is a self-hosted, open-source agent runtime you run over messaging apps. Lodestone is a native desktop app — no server to run, no channel to wire up."
              className="mb-10"
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="overflow-x-auto rounded-2xl border border-[var(--border)] site-card">
              <div className="grid grid-cols-[1fr_1.3fr_1.3fr] text-sm min-w-[640px]">
                <div className="px-4 md:px-5 py-4 text-[var(--text-dim)] font-medium border-b border-[var(--border)]" />
                <div className="px-4 md:px-5 py-4 border-b border-[var(--border)] bg-brand-500/10">
                  <span className="font-display font-bold text-brand-200">Lodestone</span>
                </div>
                <div className="px-4 md:px-5 py-4 border-b border-[var(--border)] text-[var(--text-dim)] font-medium">
                  OpenClaw
                </div>
                {OPENCLAW_ROWS.map((row) => (
                  <div key={row.label} className="contents">
                    <div className="px-4 md:px-5 py-4 text-[var(--text-muted)] font-medium border-b border-[var(--border)] last:border-0">
                      {row.label}
                    </div>
                    <div className="px-4 md:px-5 py-4 border-b border-[var(--border)] bg-brand-500/[0.06] flex items-start gap-2 text-[var(--text)]">
                      <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{row.lodestone}</span>
                    </div>
                    <div className="px-4 md:px-5 py-4 border-b border-[var(--border)] flex items-start gap-2 text-[var(--text-dim)]">
                      <Minus className="w-4 h-4 shrink-0 mt-0.5 opacity-60" />
                      <span>{row.openclaw}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <p className="mt-4 text-xs text-[var(--text-dim)] text-center max-w-2xl mx-auto">
            OpenClaw is open-source software maintained by its own community, not affiliated with
            Lodestone. Comparison reflects typical self-hosted setup as documented publicly; individual
            configurations vary.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">See it work for yourself</h2>
          <p className="text-[var(--text-muted)] mb-8">
            Join early access, or download the desktop app for {SITE.platforms.shipping.join(' & ')}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/early-access"
              className="px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold no-underline shadow-lg shadow-brand-500/30 inline-flex items-center gap-2"
            >
              Join early access
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="px-7 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 text-[var(--text)] font-medium no-underline hover:bg-[var(--surface)]"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
