import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, KeyRound, Mail, Rocket, TrendingUp } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { Eyebrow, HeroBackdrop, Reveal, SectionHeading } from '../components/SiteUI'
import { EARLY_ACCESS, EARLY_ACCESS_PACKAGES, GA_PLANS, SITE } from '../content/site'

/**
 * Early Access / founding packages page.
 * DISPLAY ONLY. Do not wire Stripe, checkout, or payment APIs here.
 */
type FoundingPackage = (typeof EARLY_ACCESS_PACKAGES)[number]

function PackageCard({ pkg, wide = false }: { pkg: FoundingPackage; wide?: boolean }) {
  const badge =
    pkg.id === 'access'
      ? 'Start here'
      : pkg.id === 'founding-studio-plus'
        ? 'Seat at the table'
        : pkg.highlighted
          ? 'Popular'
          : null
  return (
    <div
      className={`h-full rounded-2xl p-6 md:p-7 flex flex-col ${
        pkg.highlighted
          ? 'site-card-featured shadow-2xl shadow-brand-500/15'
          : wide
            ? 'site-card ring-1 ring-brand-500/25'
            : 'site-card site-card-hover'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-xl font-bold">{pkg.name}</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">{pkg.description}</p>
        </div>
        {badge && (
          <span className="shrink-0 text-[10px] uppercase tracking-wider font-semibold text-brand-100 bg-brand-500/20 px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>
      <div className="mb-5">
        <span className="font-display text-4xl font-bold">{pkg.price}</span>
        <span className="text-sm text-[var(--text-dim)] ml-2">{pkg.period}</span>
      </div>
      <ul className={`mb-6 flex-1 ${wide ? 'grid sm:grid-cols-2 gap-x-6 gap-y-2.5' : 'space-y-2.5'}`}>
        {pkg.benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
            <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-center text-sm text-[var(--text-dim)]">
        Checkout coming soon
      </div>
    </div>
  )
}

export default function EarlyAccess() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <HeroBackdrop />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-12 text-center">
          <Eyebrow icon={<Rocket className="w-3.5 h-3.5" />} className="mb-6">
            {SITE.phaseLabel} · Presale
          </Eyebrow>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-[1.05]">
            Founding <span className="text-gradient">early access</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-4 leading-relaxed">
            Lodestone isn&apos;t publicly launched yet. A founding package is a one-time buy-in that
            unlocks the alpha now. During early access all usage is your own key or local models,
            and we never charge you for usage. Rate locks and prepaid months kick in at launch.
          </p>
          <p className="text-sm text-brand-200/90 max-w-2xl mx-auto mb-4 leading-relaxed">
            {EARLY_ACCESS.freeForeverPromise}
          </p>
          <p className="text-sm text-[var(--text-dim)] max-w-xl mx-auto">
            Checkout is not live on this page yet. Packages are shown for the campaign. We&apos;ll
            announce how to claim your package separately.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <p className="text-sm text-[var(--text-muted)] mb-3">
              Not ready to commit? Get launch updates and founding news.
            </p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[var(--text-dim)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="w-full rounded-lg bg-[var(--surface-2)] border border-[var(--border)] pl-9 pr-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-medium"
              >
                Join the list
              </button>
            </form>
            <p className="mt-3 text-sm text-[var(--text-dim)]">
              <span data-signup-counter className="font-semibold text-brand-300">
                1,200+
              </span>{' '}
              builders on the early access list
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">
        <div className="grid md:grid-cols-2 gap-5">
          {EARLY_ACCESS_PACKAGES.map((pkg, i) => {
            const isPartner = pkg.id === 'founding-studio-plus'
            return (
              <Reveal key={pkg.id} delay={(i % 2) * 90} className={isPartner ? 'md:col-span-2' : ''}>
                <PackageCard pkg={pkg} wide={isPartner} />
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* From the founders */}
      <section className="py-14 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <Reveal>
            <div className="site-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex -space-x-2">
                  <div className="w-11 h-11 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-display font-bold text-brand-100">
                    J
                  </div>
                  <div className="w-11 h-11 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-display font-bold text-cyan-100">
                    G
                  </div>
                </div>
                <div>
                  <p className="font-semibold leading-tight">From the founders</p>
                  <p className="text-sm text-[var(--text-dim)]">Jay &amp; George</p>
                </div>
              </div>
              <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
                <p>
                  We&apos;re Jay and George, a two-person team building Lodestone. We got tired of AI
                  that&apos;s locked away in a browser tab, ships your data off to who-knows-where, and
                  can&apos;t actually touch anything on your computer. We didn&apos;t want another
                  chatbot. We wanted an AI that actually does something: it runs our files and tools,
                  gets real work done on our own machines, and keeps going while we&apos;re away. So we
                  built it.
                </p>
                <p>
                  We&apos;re funding this through early access instead of investors on purpose, because
                  we&apos;d rather answer to the people actually using Lodestone than a boardroom that
                  wants to harvest your data. And yes, this is our real, whole, entire job. No side
                  gigs, no day jobs, no building-this-on-weekends. It&apos;s Lodestone or bust, which
                  makes us extremely motivated to get it right. We read every email, mostly because
                  we&apos;re the only two people here to read it.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What you get now vs at launch */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              align="left"
              title="What happens now, and at launch"
              subtitle="Early access keeps things simple: buy in once, run on your own key. The paid infrastructure turns on at launch."
              className="mb-8"
            />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4">
            <Reveal>
              <div className="site-card p-6 h-full">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-brand-300" /> During early access
                </h3>
                <ul className="space-y-2.5">
                  {EARLY_ACCESS.duringEarlyAccess.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                      <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="site-card p-6 h-full">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-brand-300" /> At launch
                </h3>
                <ul className="space-y-2.5">
                  {EARLY_ACCESS.atLaunch.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                      <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How founding rates work */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading align="left" title="How founding rates work" className="mb-6" />
            <div className="space-y-4 text-[var(--text-muted)] text-sm leading-relaxed">
              <p>
                Founding Pro locks you at <strong className="text-[var(--text)]">$25/mo</strong> instead
                of the standard Pro price of $30/mo. Founding Studio and Founding Partner lock at{' '}
                <strong className="text-[var(--text)]">$50/mo</strong> instead of $60/mo. The lock holds
                for life while your subscription stays active.
              </p>
              <div className="site-card p-5 flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[var(--text)] mb-1">How prepaid months work</p>
                  <p>{EARLY_ACCESS.prepaid.note}</p>
                </div>
              </div>
              <div className="site-card p-5 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[var(--text)] mb-1">
                    Upgrade anytime before the window closes
                  </p>
                  <p>{EARLY_ACCESS.upgrades.note}</p>
                </div>
              </div>
              <p>{EARLY_ACCESS.freeForeverPromise}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GA preview */}
      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface)]/30">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              title="After launch"
              subtitle="Standard plans once Lodestone is generally available."
              className="mb-8"
            />
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {GA_PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 80}>
                <div className={`h-full p-5 ${plan.highlighted ? 'site-card-featured' : 'site-card'}`}>
                  <div className="font-semibold">{plan.name}</div>
                  <div className="font-display text-xl font-bold mt-1">
                    {plan.price}
                    <span className="text-sm font-normal text-[var(--text-dim)]">{plan.period}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200 no-underline"
            >
              Full launch pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading align="left" title="Questions" className="mb-8" />
          </Reveal>
          <div className="grid gap-3">
            {[
              {
                q: 'Can I buy a package on this page?',
                a: "Not yet. This page is informational only. No payments are processed here. We'll share claim instructions when checkout opens.",
              },
              {
                q: 'Is there a free tier right now?',
                a: 'You can make a free account today, but the alpha download unlocks with a founding package during early access. A free forever Community tier (BYOK required) opens at launch, and every founder keeps it.',
              },
              {
                q: 'Do I pay for usage during early access?',
                a: "No. During early access all usage is your own API key (BYOK) or local Ollama models. We don't meter or charge for usage. Included credits, packs, and auto top-up turn on at launch.",
              },
              {
                q: 'When do my prepaid months and rate lock start?',
                a: "At launch, not automatically. You activate your subscription when you're ready and your prepaid months start then, so nothing you paid for is wasted. After prepaid runs out, billing continues at your locked founding rate. Activate within 12 months of launch.",
              },
              {
                q: 'What is BYOK?',
                a: "Bring your own API key. During early access it's how everyone runs. At launch it's required on Community and optional on Pro and Studio, where you can use included credits, buy packs, or enable auto top-up instead.",
              },
              {
                q: 'Is it safe to let it run on my computer?',
                a: 'Yes. You stay in control. Filesystem access has permission tiers from none to full, sensitive paths are blocked by default, and every action the agent takes is logged so you can see exactly what it did.',
              },
              {
                q: 'Can I use Lodestone from my browser?',
                a: 'The product is the desktop app. The web app is a companion for reaching your Lodestone from away, and that remote web access arrives after early access, not during it.',
              },
            ].map((item) => (
              <div key={item.q} className="site-card p-5">
                <h3 className="font-semibold mb-1.5">{item.q}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.a}</p>
              </div>
            ))}
            <div className="site-card p-5">
              <h3 className="font-semibold mb-1.5">Questions about a package?</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Email{' '}
                <a href={`mailto:${SITE.email}`} className="text-brand-300 no-underline">
                  {SITE.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
