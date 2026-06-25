import { Link } from 'react-router-dom'

const plans = [
  {
    id: 'community',
    name: 'Community',
    price: '$0',
    period: 'forever',
    description: 'Your AI brain, always learning',
    features: [
      { name: 'Desktop app (Mac)', included: true },
      { name: 'Unlimited chat', included: true },
      { name: '14 built-in tools', included: true },
      { name: 'Memory & knowledge graph', included: true },
      { name: 'Identity & personality', included: true },
      { name: 'Tasks & commitments', included: true },
      { name: '/recall search', included: true },
      { name: 'Conversation templates', included: true },
      { name: 'Smart daily greeting', included: true },
      { name: 'Streaming responses', included: true },
      { name: '$5 sign-up bonus', included: true },
      { name: 'Ollama Cloud models', included: true },
      { name: 'Bring your own key', included: true },
      { name: 'Web access', included: false },
      { name: 'Claude, GPT-4o, o1', included: false },
      { name: 'File uploads & RAG', included: false },
      { name: 'Conversation sharing', included: false },
    ],
    cta: 'Get started free',
    ctaStyle: 'bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface-2)]/80 border border-[var(--border)]',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29.99',
    period: '/month',
    description: 'Everything, unlocked',
    features: [
      { name: 'Everything in Community', included: true },
      { name: 'Web + desktop access', included: true },
      { name: 'Claude, GPT-4o, o1, o1-mini', included: true },
      { name: 'All AI providers', included: true },
      { name: 'File uploads & RAG', included: true },
      { name: 'Conversation sharing', included: true },
      { name: '$15/mo usage included', included: true },
      { name: 'Advanced tools & actions', included: true },
      { name: 'Custom instructions', included: true },
      { name: 'Priority support', included: true },
      { name: 'Multiple agents', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Start free trial',
    ctaStyle: 'bg-brand-500 hover:bg-brand-600 text-white',
    highlighted: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '$79.99',
    period: '/month',
    description: 'For power users & teams',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: '5 agent identities', included: true },
      { name: 'File uploads & RAG', included: true },
      { name: 'Team sharing', included: true },
      { name: 'API access', included: true },
      { name: '$40/mo usage included', included: true },
      { name: 'Dedicated support', included: true },
    ],
    cta: 'Get Studio',
    ctaStyle: 'bg-cyan-500 hover:bg-cyan-600 text-white',
    highlighted: false,
  },
]

const featureRows = [
  { feature: 'Desktop app (Mac)', community: true, pro: true, studio: true },
  { feature: 'Unlimited chat', community: true, pro: true, studio: true },
  { feature: 'Memory & knowledge', community: true, pro: true, studio: true },
  { feature: 'Tasks & commitments', community: true, pro: true, studio: true },
  { feature: '/recall search', community: true, pro: true, studio: true },
  { feature: 'Smart greeting', community: true, pro: true, studio: true },
  { feature: 'Conversation templates', community: true, pro: true, studio: true },
  { feature: 'Streaming responses', community: true, pro: true, studio: true },
  { feature: 'Bring your own key', community: true, pro: true, studio: true },
  { feature: 'Ollama Cloud (free)', community: true, pro: true, studio: true },
  { feature: 'Sign-up bonus', community: '$5', pro: '$15/mo', studio: '$40/mo' },
  { feature: 'Web access', community: false, pro: true, studio: true },
  { feature: 'Claude, GPT-4o, o1', community: false, pro: true, studio: true },
  { feature: 'File uploads & RAG', community: false, pro: true, studio: true },
  { feature: 'Conversation sharing', community: false, pro: true, studio: true },
  { feature: 'Custom instructions', community: false, pro: true, studio: true },
  { feature: 'Multiple agent identities', community: false, pro: false, studio: '5' },
  { feature: 'API access', community: false, pro: false, studio: true },
  { feature: 'Priority support', community: false, pro: true, studio: true },
  { feature: 'Dedicated support', community: false, pro: false, studio: true },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[var(--bg)] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Simple pricing. Serious brain.</h1>
          <p className="text-[var(--text-muted)] text-lg">Start free. Upgrade when you need more power.</p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 ${
                plan.highlighted
                  ? 'border-brand-500 bg-[var(--surface)] shadow-lg shadow-brand-500/10'
                  : 'border-[var(--border)] bg-[var(--surface)]'
              }`}
            >
              {plan.highlighted && (
                <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">Most popular</div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="text-[var(--text-muted)] text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-6">{plan.description}</p>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f.name} className="flex items-start gap-2 text-sm">
                    <span className={f.included ? 'text-green-400' : 'text-[var(--text-dim)]'}>
                      {f.included ? '✓' : '—'}
                    </span>
                    <span className={f.included ? 'text-[var(--text)]' : 'text-[var(--text-dim)]'}>{f.name}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`block w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Feature comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 pr-4 text-[var(--text-muted)] font-medium w-[40%]">Feature</th>
                  <th className="text-center py-3 px-3 text-[var(--text-muted)] font-medium">Community</th>
                  <th className="text-center py-3 px-3 text-brand-400 font-semibold">Pro</th>
                  <th className="text-center py-3 px-3 text-cyan-400 font-semibold">Studio</th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-[var(--surface)]' : ''}>
                    <td className="py-2.5 pr-4 text-[var(--text)]">{row.feature}</td>
                    {[row.community, row.pro, row.studio].map((val, j) => (
                      <td key={j} className="text-center py-2.5 px-3">
                        {typeof val === 'string' ? (
                          <span className="text-xs font-medium text-brand-400">{val}</span>
                        ) : val === true ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-[var(--text-dim)]">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-12">
          <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-[var(--text)] mb-2">Private by default</h3>
            <p className="text-sm text-[var(--text-muted)]">Your conversations never leave your device with BYOK. No data harvesting, no training on your data.</p>
          </div>
          <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-[var(--text)] mb-2">Transparent pricing</h3>
            <p className="text-sm text-[var(--text-muted)]">Bring your own API key and pay nothing to Lodestone — just the provider directly.</p>
          </div>
          <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-semibold text-[var(--text)] mb-2">Compounds over time</h3>
            <p className="text-sm text-[var(--text-muted)]">Every conversation adds to your brain. Preferences, commitments, knowledge — it all accumulates.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">Common questions</h2>
          {[
            { q: 'What happens if I exceed my monthly usage?', a: 'You can purchase credit packs ($5, $10, $20, $50) or bring your own API key (BYOK) to bypass all billing. BYOK users pay nothing to Lodestone.' },
            { q: 'Can I switch tiers at any time?', a: 'Yes. Upgrade or downgrade at any time. When you upgrade, you get immediate access to all features. When you downgrade, you keep your tier until the end of your billing period.' },
            { q: 'What are the usage costs?', a: 'Provider rates vary by model. Every plan includes monthly credits. Community gets $5 sign-up bonus, Pro includes $15/mo, and Studio includes $40/mo. Bring your own API key and pay nothing to Lodestone.' },
            { q: 'Is the desktop app really free?', a: 'Yes. The macOS desktop app is free for all tiers. Community users can use it with Ollama Cloud at no cost. Pro and Studio users get access to all providers from the desktop app too.' },
          ].map(item => (
            <details key={item.q} className="group p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] cursor-pointer">
              <summary className="font-semibold text-[var(--text)] list-none flex items-center justify-between">
                <span>{item.q}</span>
                <svg className="w-5 h-5 text-[var(--text-dim)] transition-transform group-open:rotate-180 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="text-center mt-8 space-y-2">
          <p className="text-[var(--text-dim)] text-sm">
            Need custom deployment or volume pricing? <a href="mailto:hello@heylodestone.com" className="text-brand-400 hover:underline">Contact us</a> for Enterprise.
          </p>
        </div>
      </div>
    </div>
  )
}