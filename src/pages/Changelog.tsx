import { useState } from "react"

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
        "13 desktop tools — files, commands, clipboard, screenshots & more",
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
    major: "bg-brand-500/20 text-brand-400 border-brand-500/30",
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

export default function Changelog() {
  const [expanded, setExpanded] = useState<string | null>("0.5.6")

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Changelog</h1>
          <p className="text-lg text-[var(--text-muted)]">
            What's new in every version of Lodestone.
          </p>
          <p className="text-sm text-[var(--text-dim)] mt-2">
            <a href="/downloads" className="text-brand-400 hover:underline">Download latest</a> ·{" "}
            <a href="https://github.com/GreyrockStudios/lodestone-desktop/releases" className="text-brand-400 hover:underline" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </p>
        </div>

        <div className="space-y-6">
          {releases.map((release) => {
            const isExpanded = expanded === release.version
            const totalChanges = (release.changes.added?.length || 0) + (release.changes.fixed?.length || 0) + (release.changes.changed?.length || 0) + (release.changes.security?.length || 0)

            return (
              <div
                key={release.version}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : release.version)}
                  className="w-full text-left p-5 flex items-center justify-between hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-[var(--text)]">v{release.version}</div>
                    {typeBadge(release.type)}
                    <span className="text-sm text-[var(--text-muted)]">{release.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-dim)]">{totalChanges} change{totalChanges !== 1 ? "s" : ""}</span>
                    <svg
                      className={`w-5 h-5 text-[var(--text-dim)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[var(--border)]">
                    <p className="text-[var(--text-muted)] mt-3 mb-4">{release.summary}</p>

                    {release.changes.added && release.changes.added.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-green-400 mb-2">✨ New</h4>
                        <ul className="space-y-1">
                          {release.changes.added.map((item) => (
                            <li key={item} className="text-sm text-[var(--text-muted)] flex items-start gap-2">
                              <span className="text-green-400 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {release.changes.fixed && release.changes.fixed.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">🐛 Fixed</h4>
                        <ul className="space-y-1">
                          {release.changes.fixed.map((item) => (
                            <li key={item} className="text-sm text-[var(--text-muted)] flex items-start gap-2">
                              <span className="text-yellow-400 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {release.changes.changed && release.changes.changed.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">📝 Changed</h4>
                        <ul className="space-y-1">
                          {release.changes.changed.map((item) => (
                            <li key={item} className="text-sm text-[var(--text-muted)] flex items-start gap-2">
                              <span className="text-blue-400 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {release.changes.security && release.changes.security.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-red-400 mb-2">🔒 Security</h4>
                        <ul className="space-y-1">
                          {release.changes.security.map((item) => (
                            <li key={item} className="text-sm text-[var(--text-muted)] flex items-start gap-2">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-sm text-[var(--text-dim)]">
          <p>Looking for older versions? Check the{" "}
            <a href="https://github.com/GreyrockStudios/lodestone-desktop/releases" className="text-brand-400 hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub releases page
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}