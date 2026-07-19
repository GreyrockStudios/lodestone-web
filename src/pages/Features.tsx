import {
  Brain,
  CalendarClock,
  Check,
  Cpu,
  MonitorSmartphone,
  Network,
  Columns2,
  Plug,
  RefreshCw,
  Users,
  Sparkles,
} from 'lucide-react'
import { DocsNav } from '../components/ScreenshotMockup'
import { FEATURE_HIGHLIGHTS, PILLARS } from '../content/site'

const featureGroups = [
  {
    title: 'Proactive & scheduled',
    icon: CalendarClock,
    items: [
      'Self-scheduling recurring jobs — runs while you\'re away',
      'Morning briefs, weekly reviews, and follow-ups on their own',
      'Folder and inbox watchers that act when things change',
      'Every autonomous run is logged so you can audit it',
    ],
  },
  {
    title: 'Actions on your machine',
    icon: Cpu,
    items: [
      'Desktop tools (clipboard, screenshots, filesystem)',
      'Run local commands and scripts',
      'Tracked tasks and due dates from natural language',
      'Built-in tools (search, code, files, weather, and more)',
    ],
  },
  {
    title: 'Models & agents',
    icon: Cpu,
    items: [
      'Local Ollama models for private inference',
      'Cloud providers with BYOK support',
      'Side-by-side model compare',
      'Multi-agent conversations and personas (Studio)',
    ],
  },
  {
    title: 'Memory & knowledge',
    icon: Brain,
    items: [
      'Automatic fact extraction from every run',
      'Knowledge graph with searchable connections',
      '/recall to search memories and commitments',
      'Conversation templates for structured work',
    ],
  },
  {
    title: 'Control & safety',
    icon: MonitorSmartphone,
    items: [
      'Filesystem permission tiers (none → full)',
      'Sensitive paths blocked by default',
      'Local-first with BYOK — keys stay on your machine',
      'MCP server connections and marketplace',
    ],
  },
]

const highlightIcons: Record<string, typeof Brain> = {
  'Knowledge graph': Network,
  'Model compare': Columns2,
  'Scheduled tasks': CalendarClock,
  'Desktop tools': Cpu,
  'MCP connections': Plug,
  'Multi-agent chat': Users,
  'Cloud sync (optional)': RefreshCw,
}

export default function Features() {
  return (
    <article className="max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Features</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10 leading-relaxed">
        Lodestone is a desktop agent that acts on your machine and works on its own schedule —
        not a disposable chat window. And it remembers every run.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {PILLARS.map((p) => (
          <div key={p.id} className="site-card p-4">
            <h2 className="font-semibold mb-1">{p.title}</h2>
            <p className="text-sm text-[var(--text-muted)]">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {featureGroups.map((group) => {
          const Icon = group.icon
          return (
            <section key={group.title} className="site-card p-5">
              <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-brand-300">
                  <Icon className="w-4 h-4" />
                </span>
                {group.title}
              </h2>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold mb-4">Highlights</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURE_HIGHLIGHTS.map((f) => {
            const Icon = highlightIcons[f.title] ?? Sparkles
            return (
              <div key={f.title} className="site-card site-card-hover p-4 flex gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-brand-300 shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{f.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <DocsNav
        prev={{ href: '/docs/getting-started', label: 'Getting Started' }}
        next={{ href: '/docs/desktop-app', label: 'Desktop App' }}
      />
    </article>
  )
}
