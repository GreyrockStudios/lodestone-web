import { Link } from 'react-router-dom'
import { AppMockup, SidebarMockup, ChatBubble, Callout, DocsNav } from '../components/ScreenshotMockup'

export default function Features() {
  return (
    <div className="docs-content max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Features</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10">Everything Lodestone can do — across every tier.</p>

      {/* Memory & Recall */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🧠 Memory & Recall</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Every conversation teaches your agent something new. Facts, preferences, commitments, relationships — they all compound into a knowledge graph that makes every subsequent conversation smarter.
        </p>
        <AppMockup title="Lodestone — Memory">
          <div className="flex" style={{ height: 340 }}>
            <SidebarMockup active="memory" />
            <div className="flex-1 p-4">
              <h3 className="font-bold text-[var(--text)] mb-3">Knowledge Graph</h3>
              <div className="space-y-2">
                {[
                  { category: "Preferences", items: ["Prefers concise answers", "Works in web development", "Uses React + TypeScript", "Values clean code"], icon: "⚙️" },
                  { category: "Personal", items: ["Based in Vancouver, Canada", "Product designer", "Name: Alex", "Interested in AI tools"], icon: "👤" },
                  { category: "Projects", items: ["Product launch — Q3", "Client redesign — ongoing", "Side project — mobile app"], icon: "📁" },
                ].map(g => (
                  <div key={g.category} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span>{g.icon}</span>
                      <span className="text-sm font-semibold text-[var(--text)]">{g.category}</span>
                      <span className="text-xs text-[var(--text-dim)]">({g.items.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {g.items.map(i => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 text-xs">{i}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AppMockup>
        <p className="text-[var(--text-muted)] leading-relaxed mt-4">
          Use <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)] text-sm">/recall preferences</code> in chat to search your memories instantly.
        </p>
      </section>

      {/* Tasks & Commitments */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">📋 Tasks & Commitments</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Your agent tracks commitments it extracts from conversations. Mention a deadline, and it creates a task automatically. Overdue items surface in your greeting.
        </p>
        <AppMockup title="Lodestone — Tasks">
          <div className="flex" style={{ height: 340 }}>
            <SidebarMockup active="tasks" />
            <div className="flex-1 p-4">
              <h3 className="font-bold text-[var(--text)] mb-3">Tasks & Commitments</h3>
              <div className="space-y-2">
                {[
                  { text: "Follow up with the client about the proposal", due: "Due tomorrow", status: "pending", icon: "📋" },
                  { text: "Review the pull request before Friday standup", due: "Due in 2 days", status: "pending", icon: "📋" },
                  { text: "Send invoice for March retainer", due: "Overdue 2 days", status: "overdue", icon: "⚠️" },
                  { text: "Set up CI/CD pipeline for the new project", due: "Due next week", status: "pending", icon: "📋" },
                ].map(t => (
                  <div key={t.text} className={`flex items-start gap-3 p-3 rounded-lg border ${t.status === 'overdue' ? 'bg-red-500/5 border-red-500/20' : 'bg-[var(--surface)] border-[var(--border)]'}`}>
                    <span className="text-sm">{t.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-[var(--text)]">{t.text}</p>
                      <p className={`text-xs ${t.status === 'overdue' ? 'text-red-400' : 'text-[var(--text-dim)]'}`}>{t.due}</p>
                    </div>
                    <button className="text-xs text-green-400 hover:text-green-300">✓ Done</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AppMockup>
        <p className="text-[var(--text-muted)] leading-relaxed mt-4">
          Create tasks with <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)] text-sm">/task</code> or let your agent extract them automatically from conversation.
        </p>
      </section>

      {/* File Uploads */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">📎 File Uploads & RAG</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Drop files into chat and your agent reads them, extracts key facts, and stores them in your knowledge base. Supports text files, PDFs, code, and more.
        </p>
        <AppMockup title="Lodestone — File Upload">
          <div className="flex" style={{ height: 340 }}>
            <SidebarMockup active="chat" />
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-hidden space-y-1">
                <ChatBubble role="user" text="Here's the project brief for the new client. Can you summarize the key requirements?" />
                <ChatBubble role="assistant" text="I've read the brief. Here are the key requirements:

1. Responsive redesign of the marketing site (5 pages)
2. Custom CMS integration with their existing WordPress backend
3. Accessibility audit to meet WCAG 2.1 AA
4. 6-week timeline, launch by August 15

I've saved these details to memory. Want me to create tasks for each milestone?" />
              </div>
              <div className="px-4 py-2 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded border border-brand-500/30 bg-brand-500/10 text-xs text-brand-400 flex items-center gap-1.5">
                    <span>📎</span> project-brief.pdf
                  </div>
                  <div className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-dim)]">
                    Type a message...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppMockup>
        <Callout type="info" title="Pro & Studio:">File uploads and RAG (document search) are available on Pro and Studio tiers. Community tier includes text-only chat.</Callout>
      </section>

      {/* Conversation Sharing */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">💬 Conversation Sharing</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Share any conversation with a unique link. Recipients don't need an account — they get a read-only view of the entire chat, including any file attachments.
        </p>
        <AppMockup title="Lodestone — Share">
          <div className="p-6 flex items-center justify-center" style={{ minHeight: 200 }}>
            <div className="w-full max-w-md">
              <h3 className="font-bold text-[var(--text)] mb-4 text-center">Share Conversation</h3>
              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text-muted)] font-mono truncate">
                    https://heylodestone.com/share/a7f3b2c1...
                  </div>
                  <button className="px-3 py-2 rounded-lg bg-brand-500 text-white text-xs font-medium">Copy</button>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <input type="checkbox" className="rounded" defaultChecked readOnly /> Allow viewing
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <input type="checkbox" className="rounded" /> Set expiration (7 days)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </AppMockup>
        <Callout type="info" title="Pro & Studio:">Conversation sharing is available on Pro and Studio tiers.</Callout>
      </section>

      {/* Streaming */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">⚡ Streaming Responses</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Watch your agent's response appear token by token in real-time. No waiting for the full answer — start reading immediately and interrupt anytime.
        </p>
        <AppMockup title="Lodestone — Streaming">
          <div className="p-4" style={{ minHeight: 180 }}>
            <div className="flex gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              <div className="max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed bg-[var(--surface)] text-[var(--text-muted)]">
                Here are the key benefits of streaming responses:<br /><br />
                1. **Immediate feedback** — You see the first token within milliseconds<br />
                2. **Better UX** — No staring at a blank screen waiting<br />
                3. **Interruptible** — Stop generation mid-stream if the direction isn't right<span className="inline-block w-2 h-4 bg-brand-500 ml-0.5 animate-pulse" />
              </div>
            </div>
          </div>
        </AppMockup>
        <p className="text-[var(--text-muted)] leading-relaxed mt-4">
          Streaming works automatically with all providers. Just start chatting — no configuration needed.
        </p>
      </section>

      {/* Smart Greeting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">👋 Smart Greeting</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Every new conversation starts with a time-aware greeting personalized to you. Your agent notices the time of day, checks for overdue tasks, and suggests relevant actions.
        </p>
        <AppMockup title="Lodestone — Smart Greeting">
          <div className="flex" style={{ height: 300 }}>
            <SidebarMockup active="chat" />
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-hidden">
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/20">
                    <span className="text-2xl">🪨</span>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text)] mb-1">Good morning, Alex ☀️</h2>
                  <p className="text-xs text-[var(--text-muted)] mb-3">I remember 23 things about you. You have 1 overdue task.</p>
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 mb-3">
                    ⚠️ Overdue: Send invoice for March retainer
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["👋 Start fresh", "📋 Review tasks", "💡 Brainstorm", "📝 Write"].map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-muted)]">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppMockup>
      </section>

      {/* Templates */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">📝 Conversation Templates</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Start structured conversations with purpose-built templates. Each template pre-configures context, goals, and output format for common tasks.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: "📋", name: "Weekly Review", desc: "Reflect on your week, set next week's priorities" },
            { icon: "💡", name: "Brainstorm", desc: "Free-form ideation with structured output" },
            { icon: "⚖️", name: "Decision", desc: "Work through a decision with pros/cons analysis" },
            { icon: "✏️", name: "Write", desc: "Draft anything — emails, docs, social posts" },
            { icon: "📧", name: "Email", desc: "Compose and refine professional emails" },
            { icon: "☀️", name: "Daily Brief", desc: "Morning briefing with tasks and priorities" },
          ].map(t => (
            <div key={t.name} className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{t.icon}</span>
                <h3 className="font-bold text-[var(--text)] text-sm">{t.name}</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)]">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tier comparison */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Feature comparison by tier</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 pr-4 text-[var(--text-dim)] font-medium">Feature</th>
                <th className="text-center py-3 px-3 text-[var(--text-dim)] font-medium">Community</th>
                <th className="text-center py-3 px-3 text-brand-400 font-semibold">Pro</th>
                <th className="text-center py-3 px-3 text-cyan-400 font-semibold">Studio</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Chat & memory", free: "✓", pro: "✓", studio: "✓" },
                { feature: "/recall search", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Tasks & commitments", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Streaming responses", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Smart greeting", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Templates", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Ollama Cloud", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Web access", free: "—", pro: "✓", studio: "✓" },
                { feature: "Claude, GPT-4o, o1", free: "—", pro: "✓", studio: "✓" },
                { feature: "File uploads & RAG", free: "—", pro: "✓", studio: "✓" },
                { feature: "Conversation sharing", free: "—", pro: "✓", studio: "✓" },
                { feature: "Desktop app", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Multiple agents", free: "—", pro: "—", studio: "5" },
                { feature: "API access", free: "—", pro: "—", studio: "✓" },
                { feature: "Monthly usage", free: "$10", pro: "$15", studio: "$40" },
              ].map(row => (
                <tr key={row.feature} className="border-b border-[var(--border)]">
                  <td className="py-2.5 pr-4 text-[var(--text)]">{row.feature}</td>
                  <td className="text-center py-2.5 px-3 text-[var(--text-muted)]">{row.free}</td>
                  <td className="text-center py-2.5 px-3 text-brand-400">{row.pro}</td>
                  <td className="text-center py-2.5 px-3 text-cyan-400">{row.studio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DocsNav prev={{ label: "Getting Started", href: "/docs/getting-started" }} next={{ label: "Desktop App", href: "/docs/desktop-app" }} />
    </div>
  )
}