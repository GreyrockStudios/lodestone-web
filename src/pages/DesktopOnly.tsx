import { Link } from 'react-router-dom'
import { Cpu, Download, Lock, Monitor, Wrench, Brain } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { HeroBackdrop, Reveal } from '../components/SiteUI'
import { GA_PLANS, SITE } from '../content/site'

const highlights = [
  {
    icon: Cpu,
    title: 'Local AI with Ollama',
    desc: 'Run models privately on your machine. No cloud required for local chats.',
  },
  {
    icon: Brain,
    title: 'Memory & commitments',
    desc: 'Lodestone remembers what matters and tracks follow-ups for you.',
  },
  {
    icon: Wrench,
    title: 'Desktop tools',
    desc: 'Files, clipboard, screenshots, commands — native access on your computer.',
  },
  {
    icon: Lock,
    title: 'Private by default',
    desc: 'Your conversations stay local unless you choose a cloud provider.',
  },
]

export default function DesktopOnly() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <HeroBackdrop />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-14 text-center">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/25 to-cyan-500/15 border border-brand-500/30 text-brand-300 mx-auto mb-6">
            <Monitor className="w-7 h-7" />
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Lodestone runs on your <span className="text-gradient">desktop</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-8 max-w-2xl mx-auto">
            The desktop app is Lodestone — where the agent acts on your machine and runs its
            scheduled work. Reaching it remotely from the browser is a companion feature that arrives
            after early access. Download for Mac or Windows, or join a founding package for alpha
            access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link
              to="/downloads"
              className="px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold no-underline inline-flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30"
            >
              <Download className="w-4 h-4" />
              Download app
            </Link>
            <Link
              to="/early-access"
              className="px-7 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 text-[var(--text)] font-medium no-underline hover:bg-[var(--surface)]"
            >
              Early access packages
            </Link>
          </div>
          <p className="text-sm text-[var(--text-dim)]">
            {SITE.phaseLabel} · Free Community tier at launch (BYOK)
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-14">
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {highlights.map((h, i) => {
            const Icon = h.icon
            return (
              <Reveal key={h.title} delay={(i % 2) * 80}>
                <div className="site-card site-card-hover h-full p-5 flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-brand-300 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{h.title}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{h.desc}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <h2 className="font-display text-xl font-bold text-center mb-6">At launch</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {GA_PLANS.map((plan) => (
            <div key={plan.id} className={`p-5 ${plan.highlighted ? 'site-card-featured' : 'site-card'}`}>
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="font-display text-2xl font-bold mt-1">
                {plan.price}
                <span className="text-sm font-normal text-[var(--text-dim)]">{plan.period}</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">{plan.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-[var(--text-dim)] mt-6">
          <Link to="/pricing" className="text-brand-300 no-underline">
            Full pricing
          </Link>
          {' · '}
          <Link to="/login" className="text-[var(--text-muted)] no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </SiteLayout>
  )
}
