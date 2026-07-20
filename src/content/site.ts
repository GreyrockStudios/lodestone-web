/** Canonical marketing facts — single source of truth for the website. */

export const SITE = {
  name: 'Lodestone',
  tagline: 'AI that acts on its own',
  description:
    'The desktop agent that does real work on your computer — running your files, apps, and scheduled tasks on your machine, even while you\'re away. It remembers everything, so it gets better every run.',
  phase: 'early-access' as const,
  phaseLabel: 'Early Access',
  email: 'hello@heylodestone.com',
  github: 'https://github.com/GreyrockStudios/lodestone-desktop',
  orgUrl: 'https://arcticstone.io',
  platforms: {
    shipping: ['macOS', 'Windows'] as const,
    coming: ['Linux'] as const,
  },
}

/**
 * Remote web access = reaching your Lodestone (running on your desktop) from away.
 * The desktop app is the product; the web app is a companion. Not in early access.
 */
export const REMOTE_ACCESS = {
  available: false,
  label: 'Remote web access',
  note: 'Remote web access — reach your Lodestone from away — arrives after early access.',
} as const

/** GA (launch) plans — not yet the public free tier during early access. */
export const GA_PLANS = [
  {
    id: 'community',
    name: 'Community',
    price: '$0',
    period: 'forever',
    description: 'Free forever at launch — bring your own key',
    highlighted: false,
    cta: 'Coming at launch',
    features: [
      { name: 'Desktop app (Mac + Windows)', included: true },
      { name: 'Unlimited chat', included: true },
      { name: 'Memory & knowledge graph', included: true },
      { name: 'Tasks & commitments', included: true },
      { name: 'Built-in tools', included: true },
      { name: 'BYOK required', included: true },
      { name: 'Local-only memory (no cloud sync)', included: true },
      { name: 'Included usage credits', included: false },
      { name: 'Remote web access', included: false },
      { name: 'Cloud sync across machines', included: false },
      { name: 'Premium cloud models', included: false },
      { name: 'File uploads & RAG', included: false },
      { name: 'Conversation sharing', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$30',
    period: '/month',
    description: 'Included usage, all providers, full workflow',
    highlighted: true,
    cta: 'See early access',
    features: [
      { name: 'Everything in Community', included: true },
      { name: 'Remote web access (after early access)', included: true },
      { name: 'Claude, GPT-4o, and more', included: true },
      { name: 'File uploads & RAG', included: true },
      { name: 'Conversation sharing', included: true },
      { name: 'Optional cloud sync across machines', included: true },
      { name: '$15/mo usage included', included: true },
      { name: 'BYOK optional', included: true },
      { name: 'Credit packs & auto top-up', included: true },
      { name: 'Priority support', included: true },
      { name: 'Multiple agent identities', included: false },
      { name: 'API access', included: false },
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '$60',
    period: '/month',
    description: 'Power users, teams, and API access',
    highlighted: false,
    cta: 'See early access',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: '5 agent identities', included: true },
      { name: 'API access', included: true },
      { name: '$40/mo usage included', included: true },
      { name: 'BYOK optional', included: true },
      { name: 'Credit packs & auto top-up', included: true },
      { name: 'MCP connections', included: true },
      { name: 'Dedicated support', included: true },
    ],
  },
] as const

export const GA_FEATURE_ROWS = [
  { feature: 'Desktop app (Mac + Windows)', community: true, pro: true, studio: true },
  { feature: 'Unlimited chat', community: true, pro: true, studio: true },
  { feature: 'Memory & knowledge', community: true, pro: true, studio: true },
  { feature: 'Tasks & commitments', community: true, pro: true, studio: true },
  { feature: 'Built-in tools', community: true, pro: true, studio: true },
  { feature: 'BYOK', community: 'Required', pro: 'Optional', studio: 'Optional' },
  { feature: 'Included usage', community: false, pro: '$15/mo', studio: '$40/mo' },
  { feature: 'Credit packs / auto top-up', community: false, pro: true, studio: true },
  { feature: 'Remote web access', community: false, pro: true, studio: true },
  { feature: 'Premium cloud models', community: false, pro: true, studio: true },
  { feature: 'File uploads & RAG', community: false, pro: true, studio: true },
  { feature: 'Conversation sharing', community: false, pro: true, studio: true },
  { feature: 'Cloud sync across machines', community: false, pro: 'Optional', studio: 'Optional' },
  { feature: 'Multiple agent identities', community: false, pro: false, studio: '5' },
  { feature: 'API access', community: false, pro: false, studio: true },
  { feature: 'Priority support', community: false, pro: true, studio: true },
] as const

/**
 * Early access / founding packages — display only; no checkout wired.
 *
 * Model: every package is a one-time founding buy-in that unlocks the alpha
 * download. During early access ALL usage is BYOK / local Ollama — we don't
 * meter or charge for usage yet. Prepaid months + rate locks activate at launch
 * (GA). A free Community tier opens forever at launch, so no founder is locked
 * out. The floor tier ($15) is deliberately more than a token amount: it filters
 * for committed testers and clears payment fees, without gating a not-ready
 * alpha behind a big commitment.
 */
export const STRIPE_FOUNDING_PRICES: Record<string, string> = {
  'access': 'price_1Tv7J2INqVL0s6U57HLDTIBH',
  'founding-pro-early': 'price_1Tv7J3INqVL0s6U5WGMpXDhJ',
  'founding-pro': 'price_1Tv7J3INqVL0s6U5MMBP5vKU',
  'founding-studio': 'price_1Tv7J4INqVL0s6U5Zd3lRYJr',
  'founding-studio-plus': 'price_1Tv7J4INqVL0s6U5YGt76b2X',
}

export const STRIPE_GA_PRICES: Record<string, { monthly: string; annual: string }> = {
  'pro': { monthly: 'price_1Tm0fEINqVL0s6U5eBj9ZC1O', annual: 'price_1Tm0fIINqVL0s6U5DHcNbzjy' },
  'studio': { monthly: 'price_1Tm0fRINqVL0s6U5YV83n8xq', annual: 'price_1Tm0fVINqVL0s6U5v9IFUAUY' },
}

export const EARLY_ACCESS_PACKAGES = [
  {
    id: 'access',
    name: 'Founding Access',
    price: '$15',
    period: 'one-time',
    description: 'Get into the alpha and back the build. Bring your own key, and we never charge you for usage.',
    highlighted: false,
    benefits: [
      'Download & run the alpha now (Mac + Windows)',
      'Full desktop app: chat, memory, tasks, tools, multi-agent',
      'Bring your own key or run local Ollama (free usage)',
      'Discord founder role & name in credits',
      'Free forever on Community at launch',
    ],
  },
  {
    id: 'founding-pro-early',
    name: 'Founding Pro · Early Bird',
    price: '$50',
    period: 'one-time',
    description: 'Lock the lowest Pro rate for life with a lighter buy-in.',
    highlighted: false,
    benefits: [
      'Everything in Founding Access',
      '~2 months of Pro included usage at launch (~$60 value)',
      'Rate locked at $25/mo for life (vs $30)',
      'Lock holds while your subscription stays active',
    ],
  },
  {
    id: 'founding-pro',
    name: 'Founding Pro',
    price: '$100',
    period: 'one-time',
    description: 'More prepaid runway at the founding Pro rate.',
    highlighted: true,
    benefits: [
      'Everything in Founding Access',
      '~4 months of Pro included usage at launch (~$120 value)',
      'Rate locked at $25/mo for life (vs $30)',
      'Lock holds while your subscription stays active',
    ],
  },
  {
    id: 'founding-studio',
    name: 'Founding Studio',
    price: '$250',
    period: 'one-time',
    description: 'Founding Studio with prepaid months and a locked rate.',
    highlighted: false,
    benefits: [
      'Everything in Founding Access',
      '~4–5 months of Studio included usage at launch (~$240–300 value)',
      'Rate locked at $50/mo for life (vs $60)',
      'Lock holds while your subscription stays active',
    ],
  },
  {
    id: 'founding-studio-plus',
    name: 'Founding Partner',
    price: '$600',
    period: 'one-time',
    description: 'Everything in Studio for life, plus a real seat at the table with us.',
    highlighted: false,
    benefits: [
      'Everything in Founding Studio',
      '~12 months of Studio included usage at launch (~$720 value)',
      'Rate locked at $50/mo for life',
      'A standing seat in our founders meetings: sit in, ask questions, and give input directly to us',
      'Real influence on what we build next (we ship what founders actually ask for)',
      'Early access to every new feature before anyone else',
    ],
  },
] as const

/**
 * How early access works and what changes at launch (GA).
 * Display copy only — no billing logic is wired from here.
 */
export const EARLY_ACCESS = {
  floorPrice: '$15',
  freeForeverPromise:
    'Founding access is paid during early access. At launch, a free Community tier is available forever (BYOK required). No founder is ever locked out.',
  duringEarlyAccess: [
    'Founding packages are a one-time buy-in that unlocks the alpha download.',
    'All usage is bring-your-own-key or local Ollama. We don\'t meter or charge for usage yet.',
    'You get the full desktop app: chat, memory, tasks, tools, and multi-agent.',
    'Remote web access, cloud sync, and included cloud credits arrive at launch.',
  ],
  atLaunch: [
    'A free Community tier opens forever (BYOK required). Every founder keeps it.',
    'Included usage, credit packs, cloud sync, and remote web access turn on.',
    'Founding rate locks and prepaid months activate (see how prepaid works below).',
  ],
  /** Prepaid months are activation-based, not auto-started at launch. */
  prepaid: {
    model: 'activation' as const,
    note: 'Your prepaid months don\'t start automatically at launch. You activate your subscription when you\'re ready and the clock starts then, so none of the runway you paid for is wasted. We\'ll remind you before it runs out; after that, billing continues at your locked founding rate. Activate within 12 months of launch.',
  },
  /** Pay-the-difference upgrades between founding tiers, allowed until the window closes. */
  upgrades: {
    note: 'Start small and move up whenever you want. Before the founding window closes you can jump to a higher tier by paying only the difference (for example, Founding Pro to Founding Studio for the $150 gap). Upgrades only, and the founding window closes at launch.',
  },
} as const

export const CREDITS = {
  communitySignupBonusAtGa: null as null, // Community is BYOK-only at GA
  proIncludedMonthly: '$15',
  studioIncludedMonthly: '$40',
  byokRequiredOnCommunity: true,
  byokOptionalOnPaid: true,
  packsAndAutoTopUp: true,
}

/** The three ways to run Lodestone — makes the pricing/usage choices explicit. */
export const USAGE_OPTIONS = [
  {
    title: 'Free — your key or local models',
    desc: 'Run the free Community tier with your own API key (BYOK) or fully local Ollama models. You only pay your provider directly — or nothing at all for local models.',
  },
  {
    title: 'Paid — included usage, buy more as needed',
    desc: 'Pro and Studio include monthly Lodestone usage credits. Exceed them and you can buy credit packs or turn on auto top-up so nothing stalls mid-flow.',
  },
  {
    title: 'Paid — send overage to your own key',
    desc: 'Keep BYOK on with a paid plan and route usage beyond your included credits straight to your own provider key — zero Lodestone markup on those messages.',
  },
] as const

/** Optional cloud sync — a paid feature; local-only by default. */
export const CLOUD_SYNC = {
  note: 'Optional cloud sync keeps your Lodestone — memory, identity, and settings — the same across every machine. Turn it off to keep everything stored locally only.',
} as const

export const PILLARS = [
  {
    id: 'acts',
    title: 'Acts on your machine',
    desc: 'Reads and writes files, runs commands, controls local apps, grabs screenshots — real actions a browser tab can\'t touch.',
  },
  {
    id: 'proactive',
    title: 'Works while you\'re away',
    desc: 'Schedules its own recurring jobs. Morning briefs, follow-ups, watchers — it runs on its own and reports back, no prompt required.',
  },
  {
    id: 'memory',
    title: 'Remembers every run',
    desc: 'Preferences, decisions, and context compound across every task, so each autonomous run is smarter than the last.',
  },
] as const

export const COMPARISON_ROWS = [
  {
    label: 'Runs on a schedule',
    lodestone: 'Wakes itself up and works unprompted',
    others: 'Only responds when you type',
  },
  {
    label: 'Your computer',
    lodestone: 'Reads/writes files, runs local apps & commands',
    others: 'Sandboxed to a browser tab',
  },
  {
    label: 'While you\'re away',
    lodestone: 'Completes jobs and reports back',
    others: 'Nothing happens until you return',
  },
  {
    label: 'Memory',
    lodestone: 'Compounds across every run',
    others: 'Resets or stays shallow',
  },
  {
    label: 'Models & privacy',
    lodestone: 'Local + cloud, BYOK, runs offline',
    others: 'Locked to one vendor\'s servers',
  },
] as const

/**
 * Named "us vs them" comparison for the /compare SEO page.
 * Rows reflect standard consumer offerings and stay to defensible, category-level
 * capability claims (see the disclaimer rendered on the page).
 */
export const VS_COLUMNS = ['Lodestone', 'ChatGPT', 'Claude', 'Copilot'] as const

export const VS_ROWS = [
  { feature: 'Runs on your desktop, not just a browser tab', values: [true, false, false, 'IDE only'] },
  { feature: 'Reads & writes your local files', values: [true, false, false, 'Repo only'] },
  { feature: 'Runs local commands on your machine', values: [true, false, false, false] },
  { feature: 'Self-scheduled tasks that run while you\'re away', values: [true, false, false, false] },
  { feature: 'Local / offline models (no cloud required)', values: [true, false, false, false] },
  { feature: 'Compounding long-term memory', values: [true, 'Limited', 'Limited', false] },
  { feature: 'Bring your own API key', values: [true, false, false, false] },
  { feature: 'Your data stays on your machine', values: [true, false, false, false] },
] as const

/** Capabilities that are physically impossible inside a browser tab. */
export const BROWSER_CANT = [
  {
    title: 'Touch your files',
    desc: 'Read, organize, and write files on your actual disk.',
  },
  {
    title: 'Run local commands',
    desc: 'Execute scripts and tools on your machine, not a remote sandbox.',
  },
  {
    title: 'Act on a schedule',
    desc: 'Fire recurring jobs with no browser tab open.',
  },
  {
    title: 'Work offline & private',
    desc: 'Run local models via Ollama — data never leaves your machine.',
  },
] as const

/** Examples of autonomous, self-scheduled work — drives the proactive demo. */
export const AUTONOMY_EXAMPLES = [
  {
    when: 'Every day · 8:00 AM',
    title: 'Morning brief',
    result: 'Summarized overnight changes across your project folders and flagged 2 items.',
  },
  {
    when: 'Every Fri · 4:00 PM',
    title: 'Weekly review',
    result: 'Compiled the week\'s commitments and rolled 2 unfinished tasks to Monday.',
  },
  {
    when: 'Hourly',
    title: 'Inbox watcher',
    result: 'Watched a folder for new invoices, then renamed and filed 3 automatically.',
  },
] as const

/** Trust & control — the guardrails that make autonomy safe. */
export const TRUST_POINTS = [
  {
    title: 'Permission tiers',
    desc: 'Filesystem access from none → full. You set the boundary.',
  },
  {
    title: 'Sensitive paths blocked',
    desc: 'Keys, system folders, and secrets are off-limits by default.',
  },
  {
    title: 'Every action is logged',
    desc: 'See exactly what the agent did, when, and why.',
  },
  {
    title: 'Local-first & BYOK',
    desc: 'Run offline with Ollama; your provider keys stay on your machine.',
  },
] as const

export const FEATURE_HIGHLIGHTS = [
  {
    title: 'Knowledge graph',
    desc: 'Facts, preferences, and projects stay connected and searchable.',
  },
  {
    title: 'Model compare',
    desc: 'Ask two models the same question and see both answers side by side.',
  },
  {
    title: 'Scheduled tasks',
    desc: 'Recurring briefs, reminders, and follow-ups that run on their own.',
  },
  {
    title: 'Desktop tools',
    desc: 'Files, clipboard, screenshots, commands — native access on your machine.',
  },
  {
    title: 'MCP connections',
    desc: 'Connect external tools and data sources via Model Context Protocol.',
  },
  {
    title: 'Multi-agent chat',
    desc: 'Put specialized agents in one conversation and let them build on each other.',
  },
  {
    title: 'Cloud sync (optional)',
    desc: 'Sync your Lodestone across machines on paid tiers — or keep memory stored local-only.',
  },
] as const
