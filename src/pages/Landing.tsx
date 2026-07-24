import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Brain,
  CalendarClock,
  Check,
  ClipboardList,
  Columns2,
  Cpu,
  Download,
  KeyRound,
  Lock,
  Monitor,
  MousePointerClick,
  Network,
  Plug,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { AuroraBackdrop, Eyebrow, HeroBackdrop, Reveal, SectionHeading } from '../components/SiteUI'
import InteractiveAppPreview from '../components/InteractiveAppPreview'
import ProactiveTimeline from '../components/ProactiveTimeline'
import KnowledgeGraphLazy from '../components/KnowledgeGraphLazy'
import { GraphLegend } from '../components/GraphLegend'
import {
  COMPARISON_ROWS,
  EARLY_ACCESS_PACKAGES,
  FEATURE_HIGHLIGHTS,
  GA_PLANS,
  PILLARS,
  SITE,
  TRUST_POINTS,
  ZERO_SETUP,
} from '../content/site'

const featureIcons: Record<string, typeof Brain> = {
  'Knowledge graph': Network,
  'Model compare': Columns2,
  'Scheduled tasks': CalendarClock,
  'Desktop tools': Cpu,
  'MCP connections': Plug,
  'Multi-agent chat': Users,
  'Cloud sync (optional)': RefreshCw,
}

const zeroSetupIcons = [Download, MousePointerClick, KeyRound, Sparkles]

const pillarIcons: Record<string, typeof Brain> = {
  acts: Cpu,
  proactive: CalendarClock,
  memory: Brain,
}

const trustIcons: Record<string, typeof Brain> = {
  'Permission tiers': SlidersHorizontal,
  'Sensitive paths blocked': Lock,
  'Every action is logged': ClipboardList,
  'Local-first & BYOK': ShieldCheck,
}

export default function Landing() {
  const teaserPackages = EARLY_ACCESS_PACKAGES.slice(0, 3)

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroBackdrop dense />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-20 md:pt-28 pb-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Eyebrow icon={<Sparkles className="w-3.5 h-3.5" />} className="mb-6">
              {SITE.phaseLabel} · Founding packages open
            </Eyebrow>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-5 leading-[1.03]">
              <span className="text-[var(--text)]">An AI that does the work</span>
              <br />
              <span className="text-gradient">while you&apos;re away</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-xl mx-auto mb-6 leading-relaxed">
              {SITE.description}
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 mb-6 text-xs sm:text-sm font-medium text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {ZERO_SETUP.badge}
            </div>

            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm p-2 gap-1 sm:gap-0">
                {ZERO_SETUP.steps.map((step, i) => {
                  const Icon = zeroSetupIcons[i] ?? Sparkles
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5">
                        <Icon className="w-4 h-4 text-brand-400 shrink-0" />
                        <span className="text-xs sm:text-sm text-[var(--text)] font-medium whitespace-nowrap">
                          {step}
                        </span>
                      </div>
                      {i < ZERO_SETUP.steps.length - 1 && (
                        <ArrowRight className="hidden sm:block w-4 h-4 text-[var(--text-dim)] shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Link
                to="/early-access"
                className="group px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold no-underline transition-all flex items-center gap-2 shadow-lg shadow-brand-500/30"
              >
                Join early access
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/pricing"
                className="px-7 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 text-[var(--text)] font-medium no-underline hover:bg-[var(--surface)] hover:border-[var(--text-dim)] transition-colors flex items-center gap-2"
              >
                See launch pricing
              </Link>
            </div>

            <p className="text-xs text-[var(--text-dim)]">
              Desktop app for Mac &amp; Windows · Presale now · Free Community tier at launch (BYOK)
            </p>
          </div>

          <Reveal className="max-w-5xl mx-auto" delay={80}>
            <InteractiveAppPreview />
          </Reveal>

          {/* At-a-glance strip */}
          <div className="max-w-4xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--border)]">
            {[
              { icon: Cpu, label: 'Acts on your machine' },
              { icon: CalendarClock, label: 'Works on a schedule' },
              { icon: Brain, label: 'Remembers every run' },
              { icon: Lock, label: 'Local & private' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="bg-[var(--bg)] px-4 py-5 flex flex-col items-center text-center gap-2"
              >
                <Icon className="w-5 h-5 text-brand-400" />
                <span className="text-xs text-[var(--text-muted)] font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works while you're away */}
      <section className="relative overflow-hidden py-20 md:py-24 border-y border-[var(--border)] bg-[var(--surface)]/30">
        <AuroraBackdrop variant="brand" />
        <div className="relative max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Proactive"
                eyebrowIcon={<CalendarClock className="w-3.5 h-3.5" />}
                title={<>Works while <span className="text-gradient">you&apos;re away</span></>}
                subtitle="Lodestone schedules its own recurring jobs and runs them on your machine — no prompt, no open window. You come back to finished work, not an empty chat box."
              />
              <p className="mt-6 text-sm text-[var(--text-dim)] leading-relaxed">
                Briefs, reviews, watchers, follow-ups — set it once and it keeps going. Each run is
                logged so you always see exactly what it did.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ProactiveTimeline />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="The difference"
              eyebrowIcon={<Monitor className="w-3.5 h-3.5" />}
              title="Not another chat tab"
              subtitle="A desktop agent that keeps context, runs locally, and follows through on its own — instead of forgetting you the moment you close the window."
              className="mb-12"
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
                      <X className="w-4 h-4 shrink-0 mt-0.5 opacity-60" />
                      <span>{row.others}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="text-center mt-8">
            <Link
              to="/compare"
              className="inline-flex items-center gap-1 text-sm text-brand-300 hover:text-brand-200 no-underline"
            >
              See the full comparison vs ChatGPT, Claude &amp; Copilot <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative py-20 md:py-24 border-y border-[var(--border)] bg-[var(--surface)]/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Why it works"
              title="Built to act"
              subtitle="Three principles guide everything Lodestone does."
              className="mb-14"
            />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => {
              const Icon = pillarIcons[p.id] ?? Brain
              return (
                <Reveal key={p.id} delay={i * 90}>
                  <div className="site-card site-card-hover h-full p-6">
                    <div className="mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/10 border border-brand-500/25 text-brand-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{p.title}</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust & control */}
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Trust & control"
              eyebrowIcon={<ShieldCheck className="w-3.5 h-3.5" />}
              title="You&apos;re always in control"
              subtitle="An agent that acts on its own needs guardrails you can see. Lodestone keeps you in charge of exactly what it can touch."
              className="mb-14"
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_POINTS.map((t, i) => {
              const Icon = trustIcons[t.title] ?? ShieldCheck
              return (
                <Reveal key={t.title} delay={(i % 4) * 80}>
                  <div className="site-card site-card-hover h-full p-6">
                    <div className="mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/10 border border-brand-500/25 text-brand-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold mb-1.5">{t.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Knowledge graph — memory as the multiplier */}
      <section className="relative overflow-hidden py-20 md:py-24 border-y border-[var(--border)] bg-[var(--surface)]/30">
        <AuroraBackdrop variant="dual" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Living memory"
              eyebrowIcon={<Brain className="w-3.5 h-3.5" />}
              title={<>And it remembers <span className="text-gradient">every run</span></>}
              subtitle="Every task and conversation builds a living knowledge graph. Facts, preferences, decisions, projects — all connected, so each autonomous run is smarter than the last."
              className="mb-10"
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="relative mx-auto w-full max-w-xl aspect-square rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 overflow-hidden">
              <KnowledgeGraphLazy interactive className="h-full w-full" />
            </div>
            <GraphLegend className="mt-6" />
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Capabilities"
                title="What you get"
                subtitle="The essentials — full detail lives in the docs."
              />
            </Reveal>
            <Link
              to="/docs/features"
              className="shrink-0 inline-flex items-center gap-1 text-sm text-brand-300 hover:text-brand-200 no-underline"
            >
              Feature reference <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_HIGHLIGHTS.map((f, i) => {
              const Icon = featureIcons[f.title] ?? Sparkles
              return (
                <Reveal key={f.title} delay={(i % 3) * 80}>
                  <div className="site-card site-card-hover h-full p-5">
                    <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--surface-2)] text-brand-300 border border-[var(--border)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold mb-1.5">{f.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Early access teaser */}
      <section className="relative py-20 md:py-24 border-y border-[var(--border)] bg-[var(--surface)]/30 overflow-hidden">
        <AuroraBackdrop variant="brand" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Presale"
              title="Join early access"
              subtitle="Founding packages unlock alpha access and rates locked for life. A free Community tier arrives at public launch."
              className="mb-12"
            />
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {teaserPackages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 90}>
                <div
                  className={`h-full p-6 flex flex-col ${
                    pkg.highlighted ? 'site-card-featured' : 'site-card site-card-hover'
                  }`}
                >
                  {pkg.highlighted && (
                    <span className="self-start text-[10px] uppercase tracking-wider font-semibold text-brand-200 bg-brand-500/20 px-2 py-1 rounded mb-3">
                      Most popular
                    </span>
                  )}
                  <div className="text-sm text-[var(--text-muted)] mb-1">{pkg.name}</div>
                  <div className="font-display text-3xl font-bold mb-2">
                    {pkg.price}
                    <span className="text-sm font-normal text-[var(--text-dim)] ml-1.5">{pkg.period}</span>
                  </div>
                  <p className="text-sm text-[var(--text-dim)] mb-4">{pkg.description}</p>
                  <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                    {pkg.benefits.slice(0, 3).map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/early-access"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold no-underline shadow-lg shadow-brand-500/25"
            >
              View all packages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* GA pricing note */}
      <section className="py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Reveal>
            <Eyebrow icon={<ShieldCheck className="w-3.5 h-3.5" />} className="mb-4">
              At launch
            </Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 tracking-tight">
              Standard pricing after GA
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4 text-left mb-8">
            {GA_PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 80}>
                <div
                  className={`h-full p-5 ${
                    plan.highlighted ? 'site-card-featured' : 'site-card'
                  }`}
                >
                  <div className="font-semibold">{plan.name}</div>
                  <div className="font-display text-2xl font-bold mt-1">
                    {plan.price}
                    <span className="text-sm font-normal text-[var(--text-dim)]">{plan.period}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">{plan.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-sm text-[var(--text-dim)] mb-4 max-w-xl mx-auto">
            Community requires BYOK. Paid tiers include usage credits, with optional packs and auto
            top-up. Remote web access to your Lodestone arrives after early access.
          </p>
          <Link to="/pricing" className="inline-flex items-center gap-1 text-sm text-brand-300 hover:text-brand-200 no-underline">
            Full pricing details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-500/12 via-[var(--surface)] to-indigo-500/10 px-6 py-14 md:py-16 text-center">
              <AuroraBackdrop variant="brand" />
              <div className="relative">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Put your AI to work
                </h2>
                <p className="text-[var(--text-muted)] mb-8 max-w-xl mx-auto">
                  Founding rates, alpha access, and a seat in the campaign — while early access is open.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    to="/early-access"
                    className="px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold no-underline shadow-lg shadow-brand-500/30"
                  >
                    Join early access
                  </Link>
                  <Link
                    to="/downloads"
                    className="px-7 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 text-[var(--text)] font-medium no-underline hover:bg-[var(--surface)] flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Downloads
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  )
}
