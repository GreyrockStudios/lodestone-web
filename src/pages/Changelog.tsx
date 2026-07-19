import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, Github, Plus, RefreshCw, ShieldCheck, Wrench } from "lucide-react"
import SiteLayout from "../components/SiteLayout"
import { Eyebrow, HeroBackdrop } from "../components/SiteUI"

interface Release {
  version: string
  date: string
  type: "major" | "minor" | "hotfix"
  summary: string
  changes: {
    added?: string[]
    fixed?: string[]
    changed?: string[]
    security?: string[]
  }
}

const releases: Release[] = [
  {
    version: "0.5.6",
    date: "June 24, 2026",
    type: "minor",
    summary: "Brain engine, model comparison, knowledge graph, browser automation, and more",
    changes: {
      added: [
        "Brain engine — self-improving memory, review, search, learn, tasks",
        "Knowledge graph — visual nodes/edges, search, auto-connect",
        "Model comparison — split-pane side-by-side (ModelCompare)",
        "Browser automation — screenshot, extract, action sequences",
        "Sub-agent tasks — background task CRUD + UI panel",
        "Screen understanding — screenshot + vision analysis",
        "File upload + drag & drop — upload API, drag overlay, image previews",
        "Voice input/output — mic button (Web Speech STT), TTS read-aloud",
        "Conversation branching — fork from any message",
        "Conversation search — full-text search across all conversations",
        "Scheduled tasks — API + Brain Schedule tab (hourly/daily/weekly/monthly)",
        "Export conversations — Markdown, JSON, PDF via Cmd+K",
        "Shared conversations — public link sharing with read-only view",
        "Command palette — Cmd+K for search, export, navigation, theme, commands",
        "Desktop automation — 7 tools (click, type, scroll, etc.) cross-platform",
        "MCP Marketplace — 12 curated servers, category filtering, deep-link install",
        "Pre-installed MCP servers — Filesystem, Memory, Sequential Thinking",
        "Cloud sync — opt-in, bidirectional, 5-min auto",
        "Persona management — CRUD API + selector + system prompt merge",
        "Shadow persona — toggle to fact-check with secondary model",
        "Audit log — full API + Brain tab with stats, filters, expandable entries",
        "Permission prompts — desktop modal for high-risk tool calls",
      ],
      fixed: [
        "Improved streaming reliability",
        "Better error handling for Ollama connection issues",
        "Fixed conversation deletion not syncing to cloud",
      ],
      changed: [
        "Upgraded Ollama integration to support latest models",
        "Redesigned settings page with better organization",
      ],
    },
  },
  {
    version: "0.5.5",
    date: "June 18, 2026",
    type: "minor",
    summary: "Onboarding wizard, local Ollama selector, account management",
    changes: {
      added: [
        "Onboarding wizard — setup in 4 steps",
        "Local Ollama selector — choose models from dropdown",
        "Account management — change email, password, delete account",
        "Dock badge — see unread count at a glance",
        "Auto-update — always on the latest version",
      ],
      fixed: [
        "Fixed memory leak in long conversations",
        "Fixed crash when switching models mid-conversation",
      ],
    },
  },
  {
    version: "0.5.0",
    date: "June 10, 2026",
    type: "major",
    summary: "First public alpha — desktop agent with local Ollama integration",
    changes: {
      added: [
        "Local Ollama — run AI models on your Mac, no API key needed",
        "Desktop tools — files, commands, clipboard, screenshots & more",
        "Cloud sync — opt-in, bidirectional",
        "Voice mode — push-to-talk + TTS read-aloud",
        "MCP bridge — connect external tool servers",
        "Streaming responses",
        "Conversation sharing",
      ],
    },
  },
]

const typeBadge = (type: Release["type"]) => {
  const styles = {
    major: "bg-brand-500/20 text-brand-300 border-brand-500/30",
    minor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    hotfix: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  }
  const labels = { major: "Major", minor: "Minor", hotfix: "Hotfix" }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[type]}`}>
      {labels[type]}
    </span>
  )
}

const groupMeta = {
  added: { label: "New", icon: Plus, color: "text-emerald-400", dot: "bg-emerald-400" },
  fixed: { label: "Fixed", icon: Wrench, color: "text-yellow-400", dot: "bg-yellow-400" },
  changed: { label: "Changed", icon: RefreshCw, color: "text-blue-400", dot: "bg-blue-400" },
  security: { label: "Security", icon: ShieldCheck, color: "text-red-400", dot: "bg-red-400" },
} as const

export default function Changelog() {
  const [expanded, setExpanded] = useState<string | null>("0.5.6")

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <HeroBackdrop aurora="brand" />
        <div className="relative max-w-3xl mx-auto px-4 pt-20 pb-12 text-center">
          <Eyebrow className="mb-5">Changelog</Eyebrow>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            What&apos;s <span className="text-gradient">new</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)]">
            Every version of Lodestone, in one place.
          </p>
          <p className="text-sm text-[var(--text-dim)] mt-4">
            <Link to="/downloads" className="text-brand-300 hover:underline no-underline">
              Download latest
            </Link>{" "}
            ·{" "}
            <a
              href="https://github.com/GreyrockStudios/lodestone-desktop/releases"
              className="text-brand-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14">
        {/* Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-6">
          <span
            className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-[var(--border)]"
            aria-hidden="true"
          />
          {releases.map((release) => {
            const isExpanded = expanded === release.version
            const totalChanges =
              (release.changes.added?.length || 0) +
              (release.changes.fixed?.length || 0) +
              (release.changes.changed?.length || 0) +
              (release.changes.security?.length || 0)

            return (
              <div key={release.version} className="relative">
                <span
                  className={`absolute -left-[21px] sm:-left-[27px] top-5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg)] ${
                    release.type === "major" ? "bg-brand-500" : release.type === "minor" ? "bg-cyan-500" : "bg-yellow-500"
                  }`}
                  aria-hidden="true"
                />
                <div className="site-card overflow-hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : release.version)}
                    className="w-full text-left p-5 flex items-center justify-between hover:bg-[var(--surface-2)]/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="font-display text-xl font-bold text-[var(--text)]">
                        v{release.version}
                      </div>
                      {typeBadge(release.type)}
                      <span className="text-sm text-[var(--text-muted)]">{release.date}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-[var(--text-dim)] hidden sm:inline">
                        {totalChanges} change{totalChanges !== 1 ? "s" : ""}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[var(--text-dim)] transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-[var(--border)]">
                      <p className="text-[var(--text-muted)] mt-4 mb-5">{release.summary}</p>
                      {(Object.keys(groupMeta) as (keyof typeof groupMeta)[]).map((key) => {
                        const items = release.changes[key]
                        if (!items || items.length === 0) return null
                        const meta = groupMeta[key]
                        const Icon = meta.icon
                        return (
                          <div key={key} className="mb-5 last:mb-0">
                            <h4 className={`text-sm font-semibold mb-2.5 flex items-center gap-1.5 ${meta.color}`}>
                              <Icon className="w-4 h-4" />
                              {meta.label}
                            </h4>
                            <ul className="space-y-1.5">
                              {items.map((item) => (
                                <li
                                  key={item}
                                  className="text-sm text-[var(--text-muted)] flex items-start gap-2"
                                >
                                  <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${meta.dot}`} />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-sm text-[var(--text-dim)]">
          <p className="inline-flex items-center gap-1.5">
            <Github className="w-4 h-4" />
            Looking for older versions? Check the{" "}
            <a
              href="https://github.com/GreyrockStudios/lodestone-desktop/releases"
              className="text-brand-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub releases page
            </a>
            .
          </p>
        </div>
      </div>
    </SiteLayout>
  )
}
