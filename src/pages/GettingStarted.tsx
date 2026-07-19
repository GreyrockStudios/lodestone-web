import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DocsNav, StepNumber } from '../components/ScreenshotMockup'
import { SITE } from '../content/site'

const steps = [
  {
    title: 'Join early access',
    body: (
      <>
        Review founding packages on the Early Access page. Checkout is not live on the site yet —
        we&apos;ll share claim instructions when it opens.
      </>
    ),
    link: { to: '/early-access', label: 'View founding packages' },
  },
  {
    title: 'Download the desktop app',
    body: <>Install for macOS or Windows. Linux is on the roadmap.</>,
    link: { to: '/downloads', label: 'Downloads' },
  },
  {
    title: 'Connect a model',
    body: (
      <>
        Use local Ollama for private models, or add a cloud provider. On the future Community tier,
        BYOK is required. Paid tiers include monthly usage credits; BYOK stays optional.
      </>
    ),
  },
  {
    title: 'Start chatting',
    body: (
      <>
        Mention preferences and deadlines in plain language. Lodestone stores memory, tracks
        commitments, and compounds context over time.
      </>
    ),
  },
]

export default function GettingStarted() {
  return (
    <article className="prose-invert max-w-3xl">
      <p className="text-xs font-medium text-brand-300 uppercase tracking-wider mb-2">
        {SITE.phaseLabel}
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Getting started</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10 leading-relaxed">
        Lodestone is a desktop-first AI agent. During early access, alpha builds go to founding
        package holders. At launch, a free Community tier (BYOK required) will be available to everyone.
      </p>

      <ol className="space-y-4 list-none pl-0 mb-12">
        {steps.map((step, i) => (
          <li key={step.title} className="site-card p-5 flex gap-4">
            <StepNumber n={i + 1} />
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold mb-1.5">{step.title}</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.body}</p>
              {step.link && (
                <Link
                  to={step.link.to}
                  className="inline-flex items-center gap-1 mt-3 text-sm text-brand-300 no-underline hover:text-brand-200"
                >
                  {step.link.label} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="site-card-featured p-5 mb-10">
        <h3 className="font-semibold mb-3">At launch</h3>
        <ul className="text-sm text-[var(--text-muted)] space-y-1.5">
          <li>· Community — $0 forever, BYOK required</li>
          <li>· Pro — $30/mo with included usage</li>
          <li>· Studio — $60/mo with higher limits and API access</li>
        </ul>
        <Link to="/pricing" className="inline-flex items-center gap-1 mt-3 text-sm text-brand-300 no-underline hover:text-brand-200">
          Launch pricing <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <DocsNav next={{ href: '/docs/features', label: 'Features' }} />
    </article>
  )
}
