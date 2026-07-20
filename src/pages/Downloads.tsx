import { Link, Navigate } from 'react-router-dom'
import { Apple, ArrowRight, Check, Download, Monitor, Terminal } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { Eyebrow, HeroBackdrop, Reveal } from '../components/SiteUI'
import { SITE } from '../content/site'
import { useAuth } from '../hooks/useAuth'

const platforms = [
  {
    name: 'macOS',
    icon: Apple,
    subtitle: 'Apple Silicon & Intel · macOS 13+',
    url: '/downloads/Lodestone-0.5.6-universal.dmg',
    size: '190 MB',
    note: 'Universal binary. Local Ollama, brain engine, scheduler, and desktop tools.',
    available: true,
  },
  {
    name: 'Windows',
    icon: Monitor,
    subtitle: 'Windows 10+ (x64)',
    url: '/downloads/Lodestone-Setup-0.5.6.exe',
    size: '93 MB',
    note: 'SmartScreen may warn until code signing lands — More info → Run anyway.',
    available: true,
  },
  {
    name: 'Linux',
    icon: Terminal,
    subtitle: 'Coming later',
    url: '',
    size: '—',
    note: 'Native Linux build is on the roadmap. Not available during this early access window.',
    available: false,
  },
]

const included = [
  'Local Ollama integration for private models',
  'Memory, tasks, and scheduled work',
  'Native desktop tools (files, clipboard, screenshots, and more)',
  'Optional cloud providers with BYOK',
]

export default function Downloads() {
  const { user } = useAuth()

  // If logged in, redirect to account downloads tab
  if (user) {
    return <Navigate to="/account?tab=downloads" replace />
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <HeroBackdrop aurora="brand" />
        <div className="relative max-w-3xl mx-auto px-4 md:px-6 pt-20 pb-12 text-center">
          <Eyebrow icon={<Download className="w-3.5 h-3.5" />} className="mb-5 !border-yellow-500/30 !bg-yellow-500/10 !text-yellow-300">
            {SITE.phaseLabel} · Alpha builds
          </Eyebrow>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Download <span className="text-gradient">Lodestone</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto">
            Desktop builds for Mac and Windows. Early access members get alpha access first —
            public free Community arrives at launch.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-14">
        <div className="space-y-4 mb-12">
          {platforms.map((p, i) => {
            const Icon = p.icon
            return (
              <Reveal key={p.name} delay={i * 80}>
                <div
                  className={`rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                    p.available ? 'site-card site-card-hover' : 'site-card opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-brand-300 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{p.name}</h2>
                    <p className="text-sm text-[var(--text-muted)]">{p.subtitle}</p>
                    <p className="text-xs text-[var(--text-dim)] mt-2">{p.note}</p>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    {p.available ? (
                      <a
                        href={p.url}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium no-underline"
                      >
                        <Download className="w-4 h-4" />
                        Download · {p.size}
                      </a>
                    ) : (
                      <span className="inline-block px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm text-[var(--text-dim)]">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <div className="site-card p-6 mb-8">
            <h2 className="font-semibold mb-4">What&apos;s included</h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-[var(--text-muted)]">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm justify-center">
          <Link to="/early-access" className="inline-flex items-center gap-1 text-brand-300 no-underline hover:text-brand-200">
            Early access packages <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/changelog" className="text-[var(--text-muted)] no-underline hover:text-[var(--text)]">
            Changelog
          </Link>
          <Link to="/docs/desktop-app" className="text-[var(--text-muted)] no-underline hover:text-[var(--text)]">
            Desktop docs
          </Link>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] no-underline hover:text-[var(--text)]"
          >
            GitHub
          </a>
        </div>
      </div>
    </SiteLayout>
  )
}
