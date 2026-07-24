import { Link } from 'react-router-dom'
import { ArrowRight, CalendarClock, Check, Info, Minus, RefreshCw } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { Eyebrow, HeroBackdrop, Reveal, SectionHeading } from '../components/SiteUI'
import { CLOUD_SYNC, GA_FEATURE_ROWS, GA_PLANS, SITE, USAGE_OPTIONS } from '../content/site'

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-400 mx-auto" />
  if (value === false) return <Minus className="w-4 h-4 text-[var(--text-dim)] mx-auto" />
  return <span className="text-sm text-[var(--text-muted)]">{value}</span>
}

// Published rates = provider base cost × 1.10. The 10% is a hedge for cost
// fluctuations, not the profit driver. Keep every row ≥ real cost so included
// usage (billed at these rates) never runs at a loss. A price-scanning job will
// live-update these later.
const tokenRows = [
  { provider: 'Ollama', model: 'GLM-5.1 Cloud', input: '$0.10', output: '$0.38', tiers: 'All' },
  { provider: 'Ollama', model: 'Llama 3', input: '$0.10', output: '$0.38', tiers: 'All' },
  { provider: 'OpenAI', model: 'GPT-4o-mini', input: '$0.17', output: '$0.66', tiers: 'Pro+' },
  { provider: 'OpenAI', model: 'GPT-4o', input: '$2.75', output: '$11.00', tiers: 'Pro+' },
  { provider: 'Anthropic', model: 'Claude Haiku 4.5', input: '$1.10', output: '$5.50', tiers: 'Pro+' },
  { provider: 'Anthropic', model: 'Claude Sonnet 4', input: '$3.30', output: '$16.50', tiers: 'Pro+' },
  { provider: 'Anthropic', model: 'Claude Opus 4', input: '$16.50', output: '$82.50', tiers: 'Studio' },
]

const faqs = [
  {
    q: 'Is Community free right now?',
    a: 'Not during early access. Community ($0 forever, BYOK required) launches with general availability. Join a founding package for alpha access today.',
  },
  {
    q: 'What happens if I exceed my monthly usage?',
    a: 'Buy credit packs, enable auto top-up, or switch to BYOK so provider costs go to your own key.',
  },
  {
    q: 'Can I switch tiers later?',
    a: 'Yes at launch. Founding rate locks stay in effect while your subscription remains active.',
  },
  {
    q: 'Is the desktop app free?',
    a: 'The desktop app is available to members. At launch, Community includes Mac + Windows with BYOK. Early access builds go to founding package holders.',
  },
]

export default function Pricing() {
  return (
    <SiteLayout>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <HeroBackdrop aurora="brand" />
        <div className="relative max-w-5xl mx-auto px-4 md:px-6 pt-20 pb-14 text-center">
          <Eyebrow icon={<CalendarClock className="w-3.5 h-3.5" />} className="mb-5">
            Pricing after general availability — not on sale yet
          </Eyebrow>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple plans, <span className="text-gradient">no lock-in</span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
            You&apos;re not paying for chat — you&apos;re paying for an agent that does work on its own.
            The plans below are what Lodestone costs once it reaches general availability (GA) — they
            aren&apos;t for sale during {SITE.phaseLabel.toLowerCase()}. The only pricing available
            right now lives on the{' '}
            <Link to="/early-access" className="text-brand-300 hover:text-brand-200 no-underline">
              early access page
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-14">
        {/* Early access banner */}
        <Reveal>
          <div className="mb-12 rounded-2xl border border-amber-500/30 bg-amber-500/[0.08] px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-amber-200">
                  Nothing on this page is available for purchase yet
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  These are the standard plans for after general availability (GA). During early
                  access, the only way to get Lodestone today is a one-time founding package —
                  prepaid months and locked rates included, with free Community arriving at launch.
                </p>
              </div>
              <Link
                to="/early-access"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium no-underline"
              >
                See early-access
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <SectionHeading
            eyebrow="Preview"
            eyebrowIcon={<CalendarClock className="w-3.5 h-3.5" />}
            title="What plans look like at launch"
            subtitle="A look ahead at GA pricing — not sold during early access."
            className="mb-8"
          />
        </Reveal>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 md:items-start">
          {GA_PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 90}>
              <div
                className={`relative flex flex-col p-6 h-full ${
                  plan.highlighted
                    ? 'site-card-featured md:-mt-3 md:pb-9 shadow-2xl shadow-brand-500/15'
                    : 'site-card'
                }`}
              >
                <h2 className="font-display text-lg font-bold mb-1">{plan.name}</h2>
                <p className="text-sm text-[var(--text-muted)] mb-4">{plan.description}</p>
                <div className="mb-5">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-[var(--text-dim)] ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f.name}
                      className={`flex items-start gap-2 text-sm ${
                        f.included ? 'text-[var(--text-muted)]' : 'text-[var(--text-dim)]'
                      }`}
                    >
                      {f.included ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Minus className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      {f.name}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/early-access"
                  className={`block text-center py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                    plan.highlighted
                      ? 'bg-brand-500 hover:bg-brand-400 text-white'
                      : 'border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Your options — three ways to run it */}
        <Reveal>
          <SectionHeading
            title="Three ways to run it"
            subtitle="Use your own key or local models for free, use our included usage, or do both. You're always in control of where spend goes."
            className="mb-8"
          />
          <div className="mb-8 grid md:grid-cols-3 gap-4">
            {USAGE_OPTIONS.map((opt, i) => (
              <div key={opt.title} className="site-card p-5 h-full">
                <div className="mb-3 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500/15 text-brand-200 border border-brand-500/20 font-display font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-2">{opt.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>
          <div className="mb-16 site-card p-5 flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Cloud sync (optional, paid tiers)</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{CLOUD_SYNC.note}</p>
            </div>
          </div>
        </Reveal>

        {/* Comparison table */}
        <Reveal>
          <SectionHeading
            title="Feature comparison"
            subtitle="Community, Pro, and Studio as they'll exist at general availability."
            className="mb-6"
          />
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] mb-16 site-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3.5 px-4 font-medium text-[var(--text-muted)]">Feature</th>
                  <th className="text-center py-3.5 px-3 text-[var(--text-muted)] font-medium">Community</th>
                  <th className="text-center py-3.5 px-3 text-brand-300 font-semibold bg-brand-500/[0.07]">Pro</th>
                  <th className="text-center py-3.5 px-3 text-cyan-400 font-semibold">Studio</th>
                </tr>
              </thead>
              <tbody>
                {GA_FEATURE_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3 px-4 text-[var(--text-muted)]">{row.feature}</td>
                    <td className="py-3 px-3 text-center">
                      <Cell value={row.community} />
                    </td>
                    <td className="py-3 px-3 text-center bg-brand-500/[0.05]">
                      <Cell value={row.pro} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Cell value={row.studio} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Token pricing */}
        <Reveal>
          <SectionHeading
            title="Per-token pricing"
            subtitle="You pay for tokens you use, deducted from monthly credits. BYOK users pay the provider directly — zero Lodestone markup on those messages. Local Ollama models are free."
            className="mb-6"
          />
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] mb-16 site-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3.5 px-4 text-[var(--text-muted)] font-medium">Provider</th>
                  <th className="text-left py-3.5 px-3 text-[var(--text-muted)] font-medium">Model</th>
                  <th className="text-right py-3.5 px-3 text-[var(--text-muted)] font-medium">Input / 1M</th>
                  <th className="text-right py-3.5 px-3 text-[var(--text-muted)] font-medium">Output / 1M</th>
                  <th className="text-center py-3.5 px-3 text-[var(--text-muted)] font-medium">Tiers</th>
                </tr>
              </thead>
              <tbody>
                {tokenRows.map((row) => (
                  <tr key={row.model} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2.5 px-4 text-[var(--text-muted)]">{row.provider}</td>
                    <td className="py-2.5 px-3">{row.model}</td>
                    <td className="py-2.5 px-3 text-right text-[var(--text-muted)] font-mono">{row.input}</td>
                    <td className="py-2.5 px-3 text-right text-[var(--text-muted)] font-mono">{row.output}</td>
                    <td className="py-2.5 px-3 text-center text-[var(--text-dim)]">{row.tiers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <SectionHeading title="Common questions" className="mb-8" />
          <div className="max-w-2xl mx-auto grid gap-3 mb-12">
            {faqs.map((item) => (
              <div key={item.q} className="site-card p-5">
                <h3 className="font-semibold mb-1.5">{item.q}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <p className="text-center text-sm text-[var(--text-dim)]">
          Need custom deployment?{' '}
          <a href={`mailto:${SITE.email}`} className="text-brand-300 no-underline">
            Contact us
          </a>
          .
        </p>
      </div>
    </SiteLayout>
  )
}
