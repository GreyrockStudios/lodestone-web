import { Link } from 'react-router-dom'
import { AppMockup, SidebarMockup, ChatBubble, Callout, DocsNav } from '../components/ScreenshotMockup'

export default function UsageGuide() {
  return (
    <div className="docs-content max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Usage Guide</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10">How to use every feature in Lodestone — from your first chat to power-user workflows.</p>

      {/* ===== ONBOARDING ===== */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🚀 Onboarding</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          When you first open the desktop app, you'll go through a 7-step onboarding flow. This sets up your agent's personality, privacy level, and preferred model.
        </p>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Welcome', desc: 'Introduction to Lodestone and what it can do.' },
            { step: '2', title: 'Model Selection', desc: 'Choose your default AI provider: Ollama Cloud (free, no key needed), Local Ollama (fully private), Claude (Anthropic), GPT-4o (OpenAI), or GLM Cloud (free).' },
            { step: '3', title: 'Ollama Detect', desc: 'The app automatically checks for a local Ollama installation. If not found, it offers to install it and lists available models for download.' },
            { step: '4', title: 'Personality', desc: 'Choose your agent\'s personality: Friendly, Professional, Creative, or Precise. This shapes how it communicates with you.' },
            { step: '5', title: 'Privacy', desc: 'Choose your file access tier: None (🔒 No access), Minimal (👁️ Read-only Desktop/Documents/Downloads), Standard (📂 Read/write home, blocks sensitive dirs), or Full (🔓 Full filesystem, blocks .ssh/.gnupg/.keychain/.lodestone).' },
            { step: '6', title: 'Theme', desc: 'Select Dark, Light, or System theme.' },
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

      {/* ===== SIDEBAR NAVIGATION ===== */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">📂 Sidebar Navigation</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          The sidebar is your primary navigation. On desktop, toggle it with <kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm font-mono">Cmd+Shift+S</kbd>. On web, click the hamburger menu.
        </p>
        <div className="space-y-3">
          {[
            { icon: "💬", label: "Chat", desc: "Your conversations list and active chat. Click 'New Chat' or use Cmd+K to start fresh." },
            { icon: "🧠", label: "Memory", desc: "View all memories organized by category (Preferences, Personal, Projects, etc.). Search, browse, and delete individual memories." },
            { icon: "🪪", label: "Brain", desc: "Your agent's control center with 9 tabs: Review, Search, Learn, Tasks, Graph, Browser, Audit, Schedule, and MCP." },
            { icon: "🛒", label: "Marketplace", desc: "Browse and install MCP servers to extend your agent's capabilities with external tools." },
            { icon: "⚙️", label: "Settings", desc: "All configuration: Profile, Agent Identity, Appearance, Desktop (desktop-only), Reminders, Storage, and Account." },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-[var(--text)]">{item.label}</p>
                <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CHAT PAGE ===== */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">💬 Chat Page</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          The chat page is where you spend most of your time. Here's every feature available in the chat interface.
        </p>

        {/* Smart Greeting */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Smart Greeting</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Every new conversation starts with a personalized greeting based on the time of day, your memories, and any overdue tasks. Your agent might say "Good morning, Alex ☀️" and remind you about an overdue commitment.
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

        {/* Provider Switching */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3 mt-6">Provider Switching</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Switch between AI providers per-conversation using the provider selector at the top of any chat. Available providers depend on your tier:
        </p>
        <div className="space-y-2 mb-4">
          {[
            { name: "Ollama Cloud", tier: "Free", desc: "Fast local-class models. No API key needed." },
            { name: "GLM Cloud", tier: "Free", desc: "Zhipu AI models. No API key needed." },
            { name: "Local Ollama", tier: "Free (desktop)", desc: "Run models on your machine. Fully private." },
            { name: "Claude (Anthropic)", tier: "Pro & Studio (or BYOK)", desc: "Claude 4 Sonnet, Claude 4 Opus." },
            { name: "GPT-4o (OpenAI)", tier: "Pro & Studio (or BYOK)", desc: "GPT-4o, GPT-4o-mini, o3, o4-mini." },
            { name: "Groq", tier: "Pro & Studio (or BYOK)", desc: "Llama, Mixtral, Gemma — fast inference." },
          ].map(p => (
            <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <div>
                <p className="font-medium text-[var(--text)] text-sm">{p.name}</p>
                <p className="text-xs text-[var(--text-dim)]">{p.desc}</p>
              </div>
              <span className="text-xs bg-brand-500/15 text-brand-400 px-2 py-0.5 rounded-full">{p.tier}</span>
            </div>
          ))}
        </div>

        {/* Slash Commands */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Slash Commands</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Type these commands directly in the chat input for quick actions:
        </p>
        <div className="space-y-2 mb-6">
          {[
            { cmd: "/recall <query>", desc: "Search your memories. Example: /recall preferences" },
            { cmd: "/task <description>", desc: "Create a tracked commitment. Example: /task follow up with client by Friday" },
            { cmd: "/remind <time> <message>", desc: "Set a reminder. Example: /remind 3pm call Sarah" },
            { cmd: "/template", desc: "Start a template-based session (Weekly Review, Brainstorm, Decision, Email, Daily Brief, Code Help)" },
          ].map(item => (
            <div key={item.cmd} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <code className="text-sm text-[var(--cyan)] font-mono">{item.cmd}</code>
              <p className="text-xs text-[var(--text-muted)] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Command Palette */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Command Palette</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Press <kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm font-mono">Cmd+K</kbd> (Mac) or <kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm font-mono">Ctrl+K</kbd> (Windows) to open the command palette:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {[
            { cmd: "New Chat", desc: "Start a fresh conversation" },
            { cmd: "Search", desc: "Search conversations and memories" },
            { cmd: "Export (MD/JSON/PDF)", desc: "Export the current chat" },
            { cmd: "Recall Memory", desc: "Search your knowledge graph" },
            { cmd: "Set Reminder", desc: "Create a timed reminder" },
            { cmd: "Theme", desc: "Switch dark/light/system theme" },
            { cmd: "Settings", desc: "Open app settings" },
            { cmd: "Account", desc: "Manage billing & profile" },
          ].map(item => (
            <div key={item.cmd} className="flex items-start gap-2 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-sm font-medium text-[var(--text)]">{item.cmd}</span>
              <span className="text-xs text-[var(--text-dim)]">— {item.desc}</span>
            </div>
          ))}
        </div>

        {/* Voice Input & TTS */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Voice Input & Text-to-Speech</h3>
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h4 className="font-semibold text-[var(--text)] mb-2">🎙️ Voice Input</h4>
            <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--text-muted)]">
              <li>Click the microphone button (🎙️) next to the chat input.</li>
              <li>Speak your message naturally.</li>
              <li>The text appears in the input field. Edit if needed, then press Enter to send.</li>
            </ol>
          </div>
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h4 className="font-semibold text-[var(--text)] mb-2">🔊 Text-to-Speech</h4>
            <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--text-muted)]">
              <li>Hover over any assistant message.</li>
              <li>Click the speaker icon (🔊) that appears.</li>
              <li>The message is read aloud. Click again to stop.</li>
            </ol>
          </div>
        </div>

        {/* File Uploads */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">File Uploads</h3>
        <div className="space-y-3 mb-6">
          <p className="text-[var(--text-muted)] leading-relaxed">
            Drag files into the chat or click the attach button (📎). Your agent reads the file content, extracts key facts, and stores them in your knowledge graph. Supported on Pro and Studio tiers.
          </p>
          <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--text-muted)]">
            <li>Drag and drop a file onto the chat window, or click the 📎 button.</li>
            <li>The file appears as an attachment in the input area.</li>
            <li>Type your question (e.g., "Summarize the key requirements from this brief").</li>
            <li>The agent reads the file, answers your question, and stores relevant facts in memory.</li>
          </ol>
        </div>

        {/* Conversation Sharing */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Conversation Sharing</h3>
        <div className="space-y-3 mb-6">
          <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--text-muted)]">
            <li>Open the conversation you want to share.</li>
            <li>Click the share icon (🔗) in the chat header.</li>
            <li>Optionally set an expiration date.</li>
            <li>Copy the link and send it — recipients get a read-only view, no account needed.</li>
          </ol>
        </div>

        {/* Conversation Branching */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Conversation Branching</h3>
        <div className="space-y-3 mb-6">
          <p className="text-[var(--text-muted)] leading-relaxed">
            Branch from any message to explore different directions without losing the original conversation. Both branches are preserved.
          </p>
          <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--text-muted)]">
            <li>Hover over any message in the conversation.</li>
            <li>Click the branch icon (🌿) or use the message menu.</li>
            <li>A new branch is created from that point — type your new message.</li>
            <li>Switch between branches using the branch navigator at the top of the chat.</li>
          </ol>
        </div>

        {/* Model Compare */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Model Compare</h3>
        <div className="space-y-3 mb-6">
          <p className="text-[var(--text-muted)] leading-relaxed">
            Run the same prompt across multiple models side by side to see which gives the best answer for your use case.
          </p>
          <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--text-muted)]">
            <li>Start a new chat or open an existing conversation.</li>
            <li>Click the model selector at the top of the chat.</li>
            <li>Select "Compare models" and choose which models to compare.</li>
            <li>Send your message — each model responds in its own column.</li>
          </ol>
        </div>

        {/* Templates */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Templates</h3>
        <div className="space-y-3 mb-6">
          <p className="text-[var(--text-muted)] leading-relaxed">
            Start structured conversations with pre-built templates. Each template sets context, goals, and output format for common tasks.
          </p>
          <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--text-muted)]">
            <li>Type <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)] text-sm">/template</code> in chat, or use Cmd+K and search "template".</li>
            <li>Choose from: Weekly Review, Brainstorm, Decision, Email Draft, Daily Brief, or Code Help.</li>
            <li>The conversation starts with pre-set context and goals tailored to that template.</li>
          </ol>
        </div>

        {/* Suggestions */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Quick-Start Suggestions</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          When you start a new chat, you'll see suggestion chips: Explain, Search, Brainstorm, Code, Reminder, and Weather. Click any of them to start a conversation with that intent pre-set.
        </p>

        {/* System Prompt & Personas */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">System Prompt & Personas</h3>
        <div className="space-y-3">
          <p className="text-[var(--text-muted)] leading-relaxed">
            Set a custom system prompt per conversation or use the Persona Selector to pick a persona with pre-configured behavior.
          </p>
          <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--text-muted)]">
            <li>Open a conversation and click the persona icon or settings gear.</li>
            <li>Choose an existing persona or create a new one with a custom name, icon, and system prompt.</li>
            <li>The persona shapes how the agent responds — its tone, style, and focus areas.</li>
          </ol>
        </div>
      </section>

      {/* ===== MEMORY PAGE ===== */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🧠 Memory Page</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          The Memory page shows your full knowledge graph — everything your agent has learned about you, organized by category.
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

        <div className="space-y-3 mt-4">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to use the Memory page</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li><strong>Browse memories.</strong> Click <strong>Memory</strong> in the sidebar. Memories are grouped by category: Preferences, Personal, Projects, etc.</li>
            <li><strong>Search memories.</strong> Use the search bar at the top to find specific memories by keyword.</li>
            <li><strong>Delete memories.</strong> Click the delete icon on any memory to remove it permanently.</li>
            <li><strong>View connections.</strong> The knowledge graph links related memories together, making recall more contextual.</li>
          </ol>
          <Callout type="success" title="Pro tip:">Use <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-sm">/recall</code> in chat to search memories without leaving the conversation.</Callout>
        </div>
      </section>

      {/* ===== BRAIN PAGE ===== */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🧠 Brain Page (9 Tabs)</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          The Brain page is your agent's control center. It has 9 tabs, each serving a different purpose:
        </p>
        <div className="space-y-3">
          {[
            { icon: "⚡", label: "Review", desc: "Approve or reject staged memories and skills that your agent has suggested. This is your quality gate — nothing enters your knowledge graph without your approval." },
            { icon: "🔍", label: "Search", desc: "Search across all your memories, conversations, and messages in one place. More powerful than /recall because it searches everything, not just memories." },
            { icon: "📖", label: "Learn", desc: "Enter a URL or a description of something you want the agent to learn. It fetches the content, processes it, and creates memories from the key facts." },
            { icon: "📋", label: "Tasks", desc: "Create, monitor, and manage automated tasks. Tasks can be one-off (research a topic) or recurring (weekly report). Track status, review results, and cancel tasks." },
            { icon: "🕸️", label: "Graph", desc: "Visualize your knowledge graph. See how memories connect to each other through relationships. Click nodes to explore, expand clusters, and understand your agent's knowledge." },
            { icon: "🌐", label: "Browser", desc: "Browser automation control panel. Launch automated web sessions, fill forms, extract data, and control web pages with your agent." },
            { icon: "📜", label: "Audit", desc: "Full audit log of every action your agent takes. See timestamps, action types, and details. Know exactly what your agent did and when." },
            { icon: "📅", label: "Schedule", desc: "Desktop only. Create and manage scheduled tasks that run automatically at set times. Daily reports, weekly digests, recurring reminders." },
            { icon: "🔌", label: "MCP", desc: "Model Context Protocol — connect external tool servers to extend your agent's capabilities. Browse the MCP marketplace to install integrations." },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-[var(--text)]">{item.label}</p>
                <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SETTINGS PAGE ===== */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">⚙️ Settings</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Access settings from the sidebar or via the command palette (<kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-sm font-mono">Cmd+K</kbd> → Settings). Available tabs differ between desktop and web.
        </p>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Desktop settings (6 tabs)</h3>
        <div className="space-y-3 mb-6">
          {[
            { icon: "👤", tab: "Profile", desc: "Display name, email, avatar" },
            { icon: "🧠", tab: "Agent Identity", desc: "Emoji avatar (24 choices), name, personality (Friendly/Professional/Creative/Precise), profession (8 cards: Assistant, Developer, Writer, Researcher, Educator, Analyst, Designer, Consultant), tone (Casual/Balanced/Formal), custom instructions" },
            { icon: "🎨", tab: "Appearance", desc: "Dark, light, or system theme" },
            { icon: "🖥️", tab: "Desktop", desc: "File access tiers, local Ollama management (detect, install, list/pull models), scheduled tasks, audit log, cloud sync (Pro/Studio only, auto-syncs every 5 min)" },
            { icon: "🔔", tab: "Reminders", desc: "Create, view, and manage reminders with date/time" },
            { icon: "💾", tab: "Storage", desc: "View storage usage, export all data" },
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

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Web settings (4 tabs)</h3>
        <div className="space-y-3 mb-4">
          {[
            { icon: "👤", tab: "Profile", desc: "Display name, email, avatar" },
            { icon: "🧠", tab: "Agent Identity", desc: "Same as desktop: emoji, name, personality, profession, tone, custom instructions" },
            { icon: "🎨", tab: "Appearance", desc: "Dark, light, or system theme" },
            { icon: "💾", tab: "Storage", desc: "View storage usage, export all data" },
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

        <Callout type="info" title="Desktop-only features:">File access tiers, local Ollama management, scheduled tasks, audit log, browser automation, MCP connections, and cloud sync are only available in the desktop app.</Callout>
      </section>

      {/* ===== AGENT IDENTITY ===== */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🪪 Agent Identity</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Customize how your agent behaves. In <strong>Settings → Agent Identity</strong>, you can configure:
        </p>
        <div className="space-y-3">
          {[
            { icon: "😊", label: "Avatar Emoji", desc: "Pick from 24 emojis that represents your agent (default: 🪨)" },
            { icon: "📛", label: "Name", desc: "Give your agent a name it will use to refer to itself" },
            { icon: "🎭", label: "Personality", desc: "Choose from presets: Friendly, Professional, Creative, or Precise" },
            { icon: "💼", label: "Profession", desc: "Set a role context with 8 profession cards: Assistant, Developer, Writer, Researcher, Educator, Analyst, Designer, or Consultant" },
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
        <Callout type="info" title="Multiple personas:">Studio tier supports 5 distinct agent identities. Each has its own name, personality, profession, and instructions. Switch between them per-conversation via the Persona Selector.</Callout>
      </section>

      {/* ===== ACCOUNT PAGE ===== */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">💳 Account & Billing (Web)</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          The Account page is only available on the web version (heylodestone.com). Desktop users access profile settings through Settings → Profile.
        </p>
        <div className="space-y-3">
          {[
            { icon: "👤", label: "Account Details", desc: "Display name, email, avatar — your basic identity" },
            { icon: "📊", label: "Credits & Usage", desc: "Current token usage, remaining credits, and monthly credit breakdown by provider" },
            { icon: "💰", label: "Buy Credits", desc: "Purchase credit packs: Standard ($10, ~20K messages), Pro ($25, ~50K), Bulk ($50, ~100K)" },
            { icon: "🔄", label: "Auto Top-Up", desc: "Toggle automatic credit purchases when your balance runs low" },
            { icon: "📋", label: "Subscription & Billing", desc: "View your current plan, upgrade/cancel, manage Stripe billing" },
            { icon: "🔑", label: "Change Password", desc: "Update your password securely" },
            { icon: "🚨", label: "Danger Zone", desc: "Delete your account permanently. This action cannot be undone." },
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

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold text-[var(--text)]">Credit Packs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "Standard", price: "$10", messages: "~20K messages", desc: "For casual users" },
              { name: "Pro", price: "$25", messages: "~50K messages", desc: "For power users" },
              { name: "Bulk", price: "$50", messages: "~100K messages", desc: "For heavy usage" },
            ].map(pack => (
              <div key={pack.name} className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <p className="font-bold text-[var(--text)]">{pack.name}</p>
                <p className="text-2xl font-extrabold text-brand-400">{pack.price}</p>
                <p className="text-sm text-[var(--text-muted)]">{pack.messages}</p>
                <p className="text-xs text-[var(--text-dim)]">{pack.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Callout type="info" title="BYOK:">Bring your own API key to bypass all billing. Use your own OpenAI, Anthropic, or other provider keys directly — you pay the provider, not Lodestone.</Callout>
      </section>

      {/* ===== EXPORTING CONVERSATIONS ===== */}
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

      {/* ===== DESKTOP-ONLY FEATURES ===== */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🖥️ Desktop-only Features</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          These features are only available in the desktop app (macOS and Windows):
        </p>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Scheduled Tasks</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Set up recurring tasks that run automatically. In <strong>Settings → Desktop → Scheduled Tasks</strong>, you can create tasks that execute on a schedule (daily, weekly, etc.).
        </p>
        <ol className="list-decimal pl-6 space-y-1 text-sm text-[var(--text-muted)] mb-6">
          <li>Open <strong>Settings → Desktop → Scheduled Tasks</strong>.</li>
          <li>Click "Create Task" and describe what you want (e.g., "Summarize my calendar every Monday at 9am").</li>
          <li>Set the schedule (daily, weekly, custom cron).</li>
          <li>The task runs automatically and results appear in your chat.</li>
        </ol>

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
          The desktop app can control a browser for research, form filling, and web interactions. Access it through the <strong>Brain → Browser</strong> tab. Your agent takes actions on your behalf with your permission.
        </p>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">MCP Server Connections</h3>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Model Context Protocol (MCP) lets you connect external tool servers to your agent. Browse the MCP marketplace in <strong>Brain → MCP</strong> to install integrations like database connectors, file systems, and more.
        </p>
      </section>

      {/* ===== PRICING OVERVIEW ===== */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">💳 Pricing Overview</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: "Community", price: "$0", features: ["Ollama Cloud & GLM Cloud", "Memory, /recall, tasks", "14+ built-in tools", "Desktop app (Mac & Win)", "BYOK", "$5 sign-up bonus"] },
              { name: "Pro", price: "$29.99/mo", features: ["Everything in Community", "Claude, GPT-4o, o3, o4-mini", "File uploads & RAG", "Conversation sharing", "Personas", "$15/mo credits"] },
              { name: "Studio", price: "$79.99/mo", features: ["Everything in Pro", "5 agent identities", "API access", "Browser automation", "MCP connections", "$40/mo credits"] },
              { name: "Enterprise", price: "Custom", features: ["Custom deployment", "SLA guarantee", "Volume licensing", "Dedicated support", "Contact us"] },
            ].map(t => (
              <div key={t.name} className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <h3 className="font-bold text-[var(--text)]">{t.name}</h3>
                <p className="text-xl font-extrabold text-brand-400">{t.price}</p>
                <ul className="mt-2 space-y-1">
                  {t.features.map(f => (
                    <li key={f} className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                      <span className="text-green-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-[var(--text)] mt-6">Credit Packs</h3>
          <p className="text-sm">Need more than your included credits? Purchase additional credit packs anytime:</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Standard", price: "$10", desc: "~20K messages" },
              { name: "Pro", price: "$25", desc: "~50K messages" },
              { name: "Bulk", price: "$50", desc: "~100K messages" },
            ].map(pack => (
              <div key={pack.name} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-center">
                <p className="font-bold text-[var(--text)]">{pack.name}</p>
                <p className="text-lg font-extrabold text-brand-400">{pack.price}</p>
                <p className="text-xs text-[var(--text-dim)]">{pack.desc}</p>
              </div>
            ))}
          </div>

          <Callout type="info" title="BYOK:">Bring your own API key for any provider and pay nothing to Lodestone. You only pay the provider directly. Works on every tier, including free Community.</Callout>

          <h3 className="text-lg font-semibold text-[var(--text)] mt-8 mb-2">Per-model token pricing</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">Costs are deducted from your monthly credits at the rates below. Local Ollama models are always free.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 pr-3 text-[var(--text-muted)] font-medium">Provider</th>
                  <th className="text-left py-2 px-2 text-[var(--text-muted)] font-medium">Model</th>
                  <th className="text-right py-2 px-2 text-[var(--text-muted)] font-medium">Input / 1M</th>
                  <th className="text-right py-2 px-2 text-[var(--text-muted)] font-medium">Output / 1M</th>
                  <th className="text-center py-2 px-2 text-[var(--text-muted)] font-medium">Tier</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { provider: '\u{1F999} Ollama', model: 'GLM-5.1 Cloud', inputPer1M: '$0.10', outputPer1M: '$0.38', tier: 'All', badge: 'Default' },
                  { provider: '\u{1F999} Ollama', model: 'Llama 3', inputPer1M: '$0.10', outputPer1M: '$0.38', tier: 'All', badge: '' },
                  { provider: '\u{1F999} Ollama', model: 'Mistral', inputPer1M: '$0.10', outputPer1M: '$0.38', tier: 'All', badge: '' },
                  { provider: '\u{1F7E2} OpenAI', model: 'GPT-4o-mini', inputPer1M: '$0.08', outputPer1M: '$0.33', tier: 'Pro+', badge: '' },
                  { provider: '\u{1F7E2} OpenAI', model: 'GPT-4o', inputPer1M: '$2.75', outputPer1M: '$11.00', tier: 'Pro+', badge: '' },
                  { provider: '\u{1F7E2} OpenAI', model: 'o1-mini', inputPer1M: '$3.30', outputPer1M: '$13.20', tier: 'Pro+', badge: '' },
                  { provider: '\u{1F7E2} OpenAI', model: 'o1', inputPer1M: '$16.50', outputPer1M: '$66.00', tier: 'Pro+', badge: '' },
                  { provider: '\u{1F7E3} Anthropic', model: 'Claude Haiku 4.5', inputPer1M: '$1.10', outputPer1M: '$5.50', tier: 'Pro+', badge: '' },
                  { provider: '\u{1F7E3} Anthropic', model: 'Claude Sonnet 4', inputPer1M: '$3.30', outputPer1M: '$16.50', tier: 'Pro+', badge: '' },
                  { provider: '\u{1F7E3} Anthropic', model: 'Claude Opus 4', inputPer1M: '$5.50', outputPer1M: '$27.50', tier: 'Pro+', badge: '' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[var(--surface)]' : ''}>
                    <td className="py-2 pr-3 text-[var(--text)] font-medium">{row.provider}</td>
                    <td className="py-2 px-2 text-[var(--text)]">
                      {row.model}
                      {row.badge && <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-500/20 text-green-400 border border-green-500/30">{row.badge}</span>}
                    </td>
                    <td className="text-right py-2 px-2 font-mono text-[var(--text-muted)]">{row.inputPer1M}</td>
                    <td className="text-right py-2 px-2 font-mono text-[var(--text-muted)]">{row.outputPer1M}</td>
                    <td className="text-center py-2 px-2 text-[var(--text-muted)]">{row.tier}</td>
                  </tr>
                ))}
                <tr className="border-t border-[var(--border)]">
                  <td colSpan={5} className="py-2 text-xs text-[var(--text-dim)] text-center">
                    1M = 1 million tokens. ~1 token = 4 characters. Local Ollama models are free. BYOK users pay the provider directly — zero Lodestone charges.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <DocsNav prev={{ label: "Desktop App", href: "/docs/desktop-app" }} next={{ label: "API Reference", href: "/docs/api" }} />
    </div>
  )
}
