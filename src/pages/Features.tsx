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
        <div className="space-y-3 mt-4">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to use memory</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li><strong>Just chat naturally.</strong> Mention your name, preferences, projects — your agent stores them automatically.</li>
            <li><strong>Search with /recall.</strong> Type <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)] text-sm">/recall project name</code> to find specific memories.</li>
            <li><strong>Browse the Memory page.</strong> Click <strong>Memory</strong> in the sidebar to see all stored memories organized by category.</li>
            <li><strong>Delete what you don't need.</strong> Remove individual memories from the Memory page anytime.</li>
          </ol>
        </div>
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
        <div className="space-y-3 mt-4">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to use tasks</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li><strong>Create with /task.</strong> Type <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)] text-sm">/task submit the report by Friday</code> to create a tracked commitment with a due date.</li>
            <li><strong>Natural language.</strong> Just say "I need to follow up with Sarah by tomorrow" — your agent creates the task automatically.</li>
            <li><strong>View tasks.</strong> Click <strong>Tasks</strong> in the sidebar, or open the Brain page → Tasks tab.</li>
            <li><strong>Mark complete.</strong> Click the checkmark on any task, or tell your agent "I finished the report."</li>
            <li><strong>Overdue alerts.</strong> When a task becomes overdue, it appears in your next smart greeting automatically.</li>
          </ol>
        </div>
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
        <div className="space-y-3 mt-4">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to upload files</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li><strong>Drag and drop.</strong> Drag any file from your computer into the chat window.</li>
            <li><strong>Click attach.</strong> Click the paperclip (📎) button next to the input field and select a file.</li>
            <li><strong>Ask questions.</strong> After uploading, ask your agent to summarize, analyze, or extract data from the file.</li>
            <li><strong>Facts are stored.</strong> Key information from the file is saved to your knowledge graph automatically.</li>
          </ol>
        </div>
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
        <div className="space-y-3 mt-4">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to share a conversation</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li>Open the conversation you want to share.</li>
            <li>Click the share icon (🔗) in the chat header.</li>
            <li>Optionally set an expiration date (7 days, 30 days, or never).</li>
            <li>Copy the link and send it to anyone — they can view the conversation without signing up.</li>
          </ol>
        </div>
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

      {/* Voice & TTS */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🎙️ Voice Input & Text-to-Speech</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Don't want to type? Click the microphone button and speak your message — it appears as text in the input field. Want to hear a response? Click the speaker icon on any message to hear it read aloud.
        </p>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to use voice input</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li>Click the microphone icon (🎙️) next to the chat input field.</li>
            <li>Speak your message naturally.</li>
            <li>The text appears in the input field. Edit if needed, then press Enter.</li>
          </ol>
        </div>
        <div className="space-y-3 mt-4">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to use text-to-speech</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li>Hover over any assistant message.</li>
            <li>Click the speaker icon (🔊) that appears.</li>
            <li>The message is read aloud. Click again to stop.</li>
          </ol>
        </div>
      </section>

      {/* Personas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🪪 Personas & Agent Identity</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Customize how your agent behaves. Choose from presets or create your own personas with custom names, personalities, and instructions.
        </p>
        <div className="space-y-3">
          {[
            { icon: "😊", label: "Avatar Emoji", desc: "Pick from 24 emojis that represent your agent (default: 🪨)" },
            { icon: "📛", label: "Name", desc: "Give your agent a name it will use to refer to itself" },
            { icon: "🎭", label: "Personality", desc: "Friendly, Professional, Creative, or Precise" },
            { icon: "💼", label: "Profession", desc: "8 role presets: Assistant, Developer, Writer, Researcher, Educator, Analyst, Designer, Consultant" },
            { icon: "🔊", label: "Tone", desc: "Casual, Balanced, or Formal" },
            { icon: "✍️", label: "Custom Instructions", desc: "Freeform text: 'Always respond in French' or 'Use bullet points'" },
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
        <Callout type="info" title="Multiple personas:">Studio tier supports 5 distinct agent identities, each with its own name, personality, and instructions. Switch between them per-conversation.</Callout>
      </section>

      {/* Templates */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">📝 Conversation Templates</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Start structured conversations with purpose-built templates. Each template pre-configures context, goals, and output format for common tasks.
        </p>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to start a template</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li>Type <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)] text-sm">/template</code> in the chat input.</li>
            <li>Choose from the template list (or press <kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm font-mono">Cmd+K</kbd> and search "template").</li>
            <li>The conversation starts with pre-set context and goals tailored to the template.</li>
          </ol>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {[
            { icon: "📋", name: "Weekly Review", desc: "Reflect on your week, set next week's priorities" },
            { icon: "💡", name: "Brainstorm", desc: "Free-form ideation with structured output" },
            { icon: "⚖️", name: "Decision", desc: "Work through a decision with pros/cons analysis" },
            { icon: "✏️", name: "Write", desc: "Draft anything — emails, docs, social posts" },
            { icon: "📧", name: "Email Draft", desc: "Compose and refine professional emails" },
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

      {/* Model Compare */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">📊 Model Compare</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Run the same prompt across multiple models side by side. See how GPT-4o, Claude, and Ollama compare on your exact question — all in one view.
        </p>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to use Model Compare</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li>Start a new chat or open an existing conversation.</li>
            <li>Click the model selector at the top of the chat.</li>
            <li>Select "Compare models" and choose which models to compare.</li>
            <li>Send your message — each model responds in its own column.</li>
          </ol>
        </div>
      </section>

      {/* Conversation Branching */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🌿 Conversation Branching</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Don't like where a conversation is going? Branch from any message to explore a different direction without losing the original thread. Both branches are preserved.
        </p>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">How to branch a conversation</h3>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--text-muted)]">
            <li>Hover over any message in the conversation.</li>
            <li>Click the branch icon (🌿) or use the message menu.</li>
            <li>A new branch is created from that point — type your new message.</li>
            <li>Switch between branches using the branch navigator at the top of the chat.</li>
          </ol>
        </div>
      </section>

      {/* Tools & Integrations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">🔧 14+ Built-in Tools</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
          Your agent can take action, not just talk. 14+ integrated tools let it search the web, run code, set reminders, and more — all without leaving the conversation.
        </p>
        <AppMockup title="Lodestone — Tools">
          <div className="flex" style={{ height: 360 }}>
            <SidebarMockup active="chat" />
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-hidden space-y-2">
                <ChatBubble role="user" text="What's the weather in Toronto? And remind me to call Sarah at 3pm." />
                <ChatBubble role="assistant" text="🔧 Using weather...
🔧 Using set_reminder...

Toronto is 17°C, mostly clear skies. I've set a reminder for 3pm to call Sarah. Anything else?" />
              </div>
              <div className="px-4 py-2 border-t border-[var(--border)]">
                <div className="flex flex-wrap gap-1.5">
                  {['🔍 Search', '🌐 Fetch', '🧮 Calc', '🐍 Code', '💾 Memory', '📋 Tasks', '⏰ Remind', '🌤️ Weather', '📝 Notes', '📎 Files'].map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-muted)]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AppMockup>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {[
            { icon: '🔍', name: 'Web Search', desc: 'Search the web for current information via private SearXNG' },
            { icon: '🌐', name: 'Web Fetch', desc: 'Read and extract content from any URL' },
            { icon: '🧮', name: 'Calculator', desc: 'Math, trig, statistics expressions' },
            { icon: '🐍', name: 'Code Execution', desc: 'Run Python or JavaScript in a sandbox' },
            { icon: '💾', name: 'Save & Search Memory', desc: 'Remember and recall your preferences' },
            { icon: '📋', name: 'Tasks & Commitments', desc: 'Track deadlines and obligations' },
            { icon: '⏰', name: 'Reminders', desc: '"Remind me in 30 minutes" — natural language' },
            { icon: '🌤️', name: 'Weather', desc: 'Current conditions for any city' },
            { icon: '📝', name: 'Notes', desc: 'Quick notes with titles and tags' },
            { icon: '📎', name: 'File Analysis', desc: 'Extract and analyze PDFs, CSVs, text' },
            { icon: '🧠', name: 'Smart Greeting', desc: 'Time-aware, personalized greetings' },
            { icon: '💬', name: 'Conversation Sharing', desc: 'Share chats with unique links' },
            { icon: '🔄', name: 'Slash Commands', desc: '/recall, /task, /remind, /template shortcuts' },
            { icon: '⚡', name: 'Streaming', desc: 'Real-time token-by-token responses' },
          ].map(t => (
            <div key={t.name} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{t.icon}</span>
                <h3 className="font-semibold text-[var(--text)] text-sm">{t.name}</h3>
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
                { feature: "Ollama Cloud & GLM Cloud", free: "✓", pro: "✓", studio: "✓" },
                { feature: "14+ built-in tools", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Web search", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Desktop app (Mac & Windows)", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Bring your own key (BYOK)", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Voice input & TTS", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Command palette", free: "✓", pro: "✓", studio: "✓" },
                { feature: "Claude, GPT-4o, o3, o4-mini", free: "—", pro: "✓", studio: "✓" },
                { feature: "File uploads & RAG", free: "—", pro: "✓", studio: "✓" },
                { feature: "Conversation sharing", free: "—", pro: "✓", studio: "✓" },
                { feature: "Custom instructions", free: "—", pro: "✓", studio: "✓" },
                { feature: "Personas", free: "—", pro: "✓", studio: "✓" },
                { feature: "Priority support", free: "—", pro: "✓", studio: "✓" },
                { feature: "Multiple agent identities", free: "—", pro: "—", studio: "5" },
                { feature: "API access", free: "—", pro: "—", studio: "✓" },
                { feature: "Browser automation", free: "—", pro: "—", studio: "✓" },
                { feature: "MCP server connections", free: "—", pro: "—", studio: "✓" },
                { feature: "Included credits", free: "$5 bonus", pro: "$15/mo", studio: "$40/mo" },
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
