import { Link } from 'react-router-dom'
import { AppMockup, SidebarMockup, ChatBubble, Callout, DocsNav } from '../components/ScreenshotMockup'

export default function UsageGuide() {
  return (
    <div className="docs-content max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Usage Guide</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10">How to use every feature in Lodestone — from your first chat to power-user workflows.</p>

      {/* Onboarding */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🚀 Onboarding</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          When you first open the desktop app, you'll go through a 7-step onboarding flow:
        </p>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Welcome', desc: 'Introduction to Lodestone and what it can do.' },
            { step: '2', title: 'Model selection', desc: 'Choose your default AI provider (Ollama Cloud is free, others require Pro+).' },
            { step: '3', title: 'Ollama detect', desc: 'If on desktop, the app checks for a local Ollama installation and offers to install it.' },
            { step: '4', title: 'Personality', desc: 'Pick your agent\'s personality: Balanced, Creative, Precise, or Friendly.' },
            { step: '5', title: 'Privacy', desc: 'Choose your file access level (None, Minimal, Standard, or Full).' },
            { step: '6', title: 'Theme', desc: 'Select dark, light, or system theme.' },
            { step: '7', title: 'Ready', desc: 'You\'re all set — start chatting!' },
          ].map(s => (
            <div key={s.step} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-brand-500/20">
                {s.step}
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)] mb-0.5">{s.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Callout type="info" title="Tip:">You can redo onboarding anytime by clearing <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-sm">lodestone_onboarding_complete</code> from localStorage, or by signing in fresh on a new device.</Callout>
      </section>

      {/* Command Palette */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">⌨️ Command Palette</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Press <kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm font-mono">Cmd+K</kbd> (Mac) or <kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm font-mono">Ctrl+K</kbd> (Windows) to open the command palette. This is your fastest way to access any feature:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { cmd: "New Chat", desc: "Start a fresh conversation" },
            { cmd: "Search", desc: "Search conversations and memories" },
            { cmd: "Export (MD/JSON/PDF)", desc: "Export the current chat" },
            { cmd: "Recall Memory", desc: "Search your knowledge graph" },
            { cmd: "Set Reminder", desc: "Create a timed reminder" },
            { cmd: "Theme", desc: "Switch dark/light/system" },
            { cmd: "Settings", desc: "Open app settings" },
            { cmd: "Account", desc: "Manage billing & profile" },
          ].map(item => (
            <div key={item.cmd} className="flex items-start gap-2 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-sm font-medium text-[var(--text)]">{item.cmd}</span>
              <span className="text-xs text-[var(--text-dim)]">— {item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Slash Commands */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">💬 Slash Commands</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Type these commands directly in the chat input:
        </p>
        <div className="space-y-2">
          {[
            { cmd: "/recall <query>", desc: "Search your memories. Example: /recall preferences", example: true },
            { cmd: "/task <description>", desc: "Create a tracked commitment. Example: /task follow up with client by Friday", example: true },
            { cmd: "/remind <time> <message>", desc: "Set a reminder. Example: /remind 3pm call Sarah", example: true },
            { cmd: "/template", desc: "Start a template-based session (Weekly Review, Brainstorm, etc.)", example: false },
            { cmd: "/clear", desc: "Clear the current conversation context", example: false },
          ].map(item => (
            <div key={item.cmd} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <code className="text-sm text-[var(--cyan)] font-mono">{item.cmd}</code>
              <p className="text-xs text-[var(--text-muted)] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Settings */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">⚙️ Settings</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Access settings from the sidebar or via the command palette. Available tabs differ between desktop and web:
        </p>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Desktop settings</h3>
        <div className="space-y-3 mb-6">
          {[
            { icon: "👤", tab: "Profile", desc: "Display name, email, avatar" },
            { icon: "🧠", tab: "Agent Identity", desc: "Emoji, name, personality, profession, tone, custom instructions" },
            { icon: "🎨", tab: "Appearance", desc: "Dark, light, or system theme" },
            { icon: "🖥️", tab: "Desktop", desc: "File access tier, local Ollama, scheduled tasks, audit log, cloud sync" },
            { icon: "🔔", tab: "Reminders", desc: "View and manage active reminders" },
            { icon: "💾", tab: "Storage", desc: "View storage usage, export data" },
          ].map(s => (
            <div key={s.tab} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="font-semibold text-[var(--text)]">{s.tab}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Web settings</h3>
        <div className="space-y-3 mb-4">
          {[
            { icon: "👤", tab: "Profile", desc: "Display name, email, avatar" },
            { icon: "🧠", tab: "Agent Identity", desc: "Emoji, name, personality, profession, tone, custom instructions" },
            { icon: "🎨", tab: "Appearance", desc: "Dark, light, or system theme" },
            { icon: "💾", tab: "Storage", desc: "View storage usage, export data" },
          ].map(s => (
            <div key={s.tab} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="font-semibold text-[var(--text)]">{s.tab}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Callout type="info" title="Desktop-only features:">File access tiers, local Ollama management, scheduled tasks, audit log, and cloud sync are only available in the desktop app.</Callout>
      </section>

      {/* Agent Identity */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🪪 Agent Identity</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Customize how your agent behaves. In <strong>Settings → Agent Identity</strong>, you can configure:
        </p>
        <div className="space-y-3">
          {[
            { icon: "😊", label: "Avatar Emoji", desc: "Pick an emoji that represents your agent (default: 🪨)" },
            { icon: "📛", label: "Name", desc: "Give your agent a name it will use to refer to itself" },
            { icon: "🎭", label: "Personality", desc: "Choose from presets: Friendly, Professional, Creative, Concise, or Detailed" },
            { icon: "💼", label: "Profession", desc: "Set a role context: Assistant, Developer, Writer, Researcher, Educator, Analyst, Designer, or Consultant" },
            { icon: "🔊", label: "Tone", desc: "Adjust formality: Casual, Balanced, or Formal" },
            { icon: "✍️", label: "Custom Instructions", desc: "Freeform text to shape agent behavior (e.g., 'Always respond in French' or 'Use bullet points')" },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-[var(--text)]">{item.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Memory Page */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🧠 Memory & Knowledge Graph</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          The <strong>Memory</strong> page shows your full knowledge graph — everything your agent has learned about you, organized by category.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[var(--text-muted)]">
          <li><strong className="text-[var(--text)]">Categories:</strong> Memories are grouped into Preferences, Personal, Projects, and more.</li>
          <li><strong className="text-[var(--text)]">Search:</strong> Use the search bar to find specific memories instantly.</li>
          <li><strong className="text-[var(--text)]">Delete:</strong> Remove individual memories you no longer want stored.</li>
          <li><strong className="text-[var(--text)]">Connections:</strong> The knowledge graph links related memories together, making recall more contextual.</li>
        </ul>
        <Callout type="success" title="Pro tip:">Use <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-sm">/recall</code> in chat to search memories without leaving the conversation.</Callout>
      </section>

      {/* Brain Page */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🧠 Brain</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          The <strong>Brain</strong> page manages your agent's skills and automated tasks:
        </p>
        <div className="space-y-3">
          {[
            { icon: "⚡", label: "Skills", desc: "Activated skills that extend your agent's capabilities. Browse and enable skills from the skill library." },
            { icon: "📋", label: "Brain Tasks", desc: "Automated tasks that run on your behalf — review pending, approved, and completed tasks." },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-[var(--text)]">{item.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account Page */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">💳 Account & Billing</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Manage your subscription, credits, and account details from the <strong>Account</strong> page (web only) or <strong>Settings → Profile</strong> (desktop):
        </p>
        <div className="space-y-3">
          {[
            { icon: "📊", label: "Billing", desc: "View your current plan, upgrade, or cancel your subscription" },
            { icon: "🔑", label: "License Key", desc: "Redeem a license key for Desktop or Pro tier" },
            { icon: "💰", label: "Credit Packs", desc: "Purchase additional credits ($5, $10, $20, $50) when your included usage runs out" },
            { icon: "🔒", label: "Password & Email", desc: "Change your password or email address" },
            { icon: "🖼️", label: "Avatar", desc: "Upload or change your profile picture" },
            { icon: "🚪", label: "Sign Out", desc: "Sign out of your account on this device" },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-[var(--text)]">{item.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Callout type="info" title="BYOK:">Bring your own API key to bypass all billing. Use your own OpenAI, Anthropic, or other provider keys directly — you pay the provider, not Lodestone.</Callout>
      </section>

      {/* Exporting Conversations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">📤 Exporting Conversations</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Export any conversation for archiving or sharing offline. Use the command palette (<kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-sm font-mono">Cmd+K</kbd>) and select "Export":
        </p>
        <div className="space-y-2">
          {[
            { format: "Markdown (.md)", desc: "Clean, readable format. Great for notes and documentation." },
            { format: "JSON (.json)", desc: "Structured data with all metadata. Best for backups and programmatic access." },
            { format: "PDF (.pdf)", desc: "Print-ready format. Good for sharing with non-technical people." },
          ].map(f => (
            <div key={f.format} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <p className="font-semibold text-[var(--text)]">{f.format}</p>
              <p className="text-xs text-[var(--text-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop-only features */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🖥️ Desktop-only Features</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          These features are only available in the desktop app (macOS and Windows):
        </p>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Scheduled Tasks</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Set up recurring tasks that run automatically. In <strong>Settings → Desktop → Scheduled Tasks</strong>, you can create tasks that execute on a schedule (daily, weekly, etc.).
        </p>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Audit Log</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Every action your agent takes is logged. Review what happened when in <strong>Settings → Desktop → Audit Log</strong>. Entries include timestamps, action types, and details.
        </p>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Sub-Agents</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Create specialized sub-agents with their own identity and instructions. Each sub-agent operates semi-independently, handling specific tasks or workflows.
        </p>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Cloud Sync</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Available on Pro and Studio tiers. Enable in <strong>Settings → Desktop → Cloud Sync</strong> to keep conversations, memories, and commitments in sync across devices. Auto-syncs every 5 minutes.
        </p>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Browser Automation</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          The desktop app can control a browser for research, form filling, and web interactions. Your agent takes actions on your behalf with your permission.
        </p>
      </section>

      <DocsNav prev={{ label: "Desktop App", href: "/docs/desktop-app" }} next={{ label: "API Reference", href: "/docs/api" }} />
    </div>
  )
}
