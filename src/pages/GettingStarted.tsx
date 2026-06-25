import { Link } from 'react-router-dom'
import { AppMockup, SidebarMockup, ChatBubble, Callout, DocsNav } from '../components/ScreenshotMockup'

export default function GettingStarted() {
  return (
    <div className="docs-content max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Getting Started</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10">Create your account, connect a model, and start chatting in under two minutes.</p>

      {/* Hero mockup of the app */}
      <AppMockup title="Lodestone — Your AI, Always Learning">
        <div className="flex" style={{ height: 380 }}>
          <SidebarMockup />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-hidden">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
                  <span className="text-3xl">🪨</span>
                </div>
                <h2 className="text-lg font-bold text-[var(--text)] mb-1">Burning the midnight oil?</h2>
                <p className="text-xs text-[var(--text-muted)] mb-4">I remember details about you. What can I help with?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["👋 New conversation", "💡 Brainstorm", "📝 Write", "🔧 Code"].map(t => (
                    <span key={t} className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-muted)]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-dim)]">
                  Type a message... (use /recall to search memories)
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppMockup>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">1. Create an account</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            Visit <Link to="/register" className="text-[var(--cyan)] hover:underline">heylodestone.com/register</Link> and sign up with your email and a password. You will receive a verification email — click the link to activate your account.
          </p>
          <p>
            If you already have an account, head to <Link to="/login" className="text-[var(--cyan)] hover:underline">heylodestone.com/login</Link>.
          </p>

          {/* Login form mockup */}
          <AppMockup title="Sign in — Lodestone">
            <div className="flex items-center justify-center p-8 bg-[var(--bg)]">
              <div className="w-full max-w-xs">
                <div className="flex items-center gap-2 justify-center mb-6">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                  <span className="text-xl font-bold text-[var(--text)]">Lodestone</span>
                </div>
                <h2 className="text-lg font-bold text-center mb-4 text-[var(--text)]">Welcome back</h2>
                <div className="space-y-3">
                  <div className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-dim)]">you@example.com</div>
                  <div className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-dim)]">••••••••</div>
                  <div className="px-3 py-2 rounded-lg bg-brand-500 text-white text-center text-sm font-semibold">Sign in</div>
                </div>
              </div>
            </div>
          </AppMockup>

          <Callout type="info" title="Tip:">Your display name is what your agent will call you. Pick something you like — you can always change it later in Settings.</Callout>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">2. Choose your model provider</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            Lodestone supports multiple AI providers. On the Community tier, Ollama Cloud is included free. Pro and Studio tiers unlock Claude, GPT-4o, o1, and more.
          </p>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--text)]">Supported providers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Ollama Cloud", key: "Free — included with Community", desc: "Fast local-class models. No API key needed.", free: true },
                { name: "OpenAI", key: "GPT-4o, GPT-4o-mini, o3, o4-mini", desc: "Pro & Studio tiers" },
                { name: "Anthropic", key: "Claude 4 Sonnet, Claude 4 Opus", desc: "Pro & Studio tiers" },
                { name: "Groq", key: "Llama, Mixtral, Gemma — fast inference", desc: "Pro & Studio tiers" },
              ].map(p => (
                <div key={p.name} className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-[var(--text)]">{p.name}</p>
                    {p.free && <span className="text-xs bg-brand-500/15 text-brand-400 px-2 py-0.5 rounded-full font-medium">Free</span>}
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mb-1">{p.key}</p>
                  <p className="text-xs text-[var(--text-dim)]">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p>
            To add a key, go to <strong>Settings → Providers</strong>, select your provider, and paste the key. It is validated immediately — if it works, you are ready to chat.
          </p>

          {/* Settings mockup */}
          <AppMockup title="Settings — Providers">
            <div className="flex" style={{ height: 300 }}>
              <SidebarMockup active="settings" />
              <div className="flex-1 p-4">
                <h3 className="font-bold text-[var(--text)] mb-4">Providers</h3>
                <div className="space-y-2">
                  {[
                    { name: "Ollama Cloud", status: "Connected", statusColor: "text-green-400", icon: "🦙" },
                    { name: "OpenAI", status: "Add API key", statusColor: "text-[var(--text-dim)]", icon: "🟢" },
                    { name: "Anthropic", status: "Add API key", statusColor: "text-[var(--text-dim)]", icon: "🟠" },
                    { name: "Groq", status: "Add API key", statusColor: "text-[var(--text-dim)]", icon: "⚡" },
                  ].map(p => (
                    <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{p.icon}</span>
                        <span className="text-sm font-medium text-[var(--text)]">{p.name}</span>
                      </div>
                      <span className={`text-xs ${p.statusColor}`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AppMockup>

          <Callout type="success" title="Community tier:">Ollama Cloud is included free — no API key needed. Just sign up and start chatting.</Callout>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">3. Start chatting</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            Click <strong>New Chat</strong> or start from the home screen. Your agent starts fresh — but from here on, it remembers everything.
          </p>

          {/* Chat conversation mockup */}
          <AppMockup title="Lodestone — Chat">
            <div className="flex" style={{ height: 380 }}>
              <SidebarMockup active="chat" />
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4 overflow-hidden space-y-1">
                  <ChatBubble role="user" text="Hey! I'm Alex — I'm a product designer working on a new SaaS app. I prefer concise answers." />
                  <ChatBubble role="assistant" text="Hey Alex! Nice to meet you. I've noted that you're a product designer and prefer concise responses. I'll keep that in mind. What are you working on?" />
                  <ChatBubble role="user" text="Can you help me brainstorm landing page ideas for a new product?" />
                  <ChatBubble role="assistant" text="Here are 3 approaches that work well for SaaS:

1. Problem-first — Lead with the pain point, then reveal the solution
2. Social proof — Show real metrics and testimonials above the fold
3. Interactive demo — Let visitors try the product in 30 seconds

Which direction fits your product?" />
                </div>
                <div className="px-4 py-2 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-dim)]">
                      Type a message... (use /recall to search memories)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AppMockup>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[var(--text)]">First conversation tips</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Tell it about yourself.</strong> Your name, your work, your preferences. It stores this in memory permanently.</li>
              <li><strong>Use the tools.</strong> Say "Search the web for..." or "What's the weather in Tokyo?" — the AI picks the right tool automatically. 12 built-in: search, code, reminders, weather, and more.</li>
              <li><strong>Try /recall.</strong> Type <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)] text-sm">/recall preferences</code> to search your memories at any time.</li>
              <li><strong>Use /task.</strong> Type <code className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--cyan)] text-sm">/task follow up with the client by Friday</code> to create tracked commitments.</li>
              <li><strong>Set reminders.</strong> Say "Remind me to call Sarah at 3pm" — you'll get an email notification when it's due.</li>
              <li><strong>Run code.</strong> Ask "Run this Python code" or "Calculate 2^20" — sandboxed execution, instant results.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">4. Key features to explore</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>After your first conversation, here are the features that make Lodestone different from any other AI chat:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { icon: "🧠", title: "Memory & /recall", desc: "Your agent remembers everything across conversations. Search memories with /recall." },
              { icon: "🔧", title: "14 built-in tools", desc: "Web search, code execution, reminders, weather, memory, and more. Used automatically." },
              { icon: "📋", title: "Tasks & commitments", desc: "Use /task to create tracked to-dos with due dates. Overdue items surface automatically." },
              { icon: "⏰", title: "Smart reminders", desc: "Say 'remind me in 30 min' and get an email notification. No app needed." },
              { icon: "🐍", title: "Code execution", desc: "Run Python and JavaScript in a sandbox. Calculate, analyze, and process data." },
              { icon: "🤖", title: "6 AI providers", desc: "Ollama Cloud (free), OpenAI, Anthropic, Groq, and more. Switch per-conversation." },
            ].map(f => (
              <div key={f.title} className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{f.icon}</span>
                  <h3 className="font-bold text-[var(--text)] text-sm">{f.title}</h3>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">5. Upgrade when you are ready</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            The Community tier is free forever with Ollama Cloud. When you need more — Claude, GPT-4o, file uploads, sharing — check out our <Link to="/pricing" className="text-[var(--cyan)] hover:underline">pricing plans</Link>.
          </p>

          {/* Pricing comparison mini */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {[
              { name: "Community", price: "$0", color: "text-[var(--text-muted)]", features: ["Ollama Cloud", "14 built-in tools", "Memory & /recall", "Tasks & commitments", "$5 sign-up bonus"] },
              { name: "Pro", price: "$29.99/mo", color: "text-brand-400", popular: true, features: ["Everything in Community", "Claude, GPT-4o, o1", "File uploads & RAG", "Conversation sharing", "$15/mo usage included"] },
              { name: "Studio", price: "$79.99/mo", color: "text-cyan-400", features: ["Everything in Pro", "5 agent identities", "API access", "$40/mo usage included", "Dedicated support"] },
            ].map(t => (
              <div key={t.name} className={`p-4 rounded-lg bg-[var(--surface)] ${t.popular ? "border-2 border-brand-500" : "border border-[var(--border)]"}`}>
                {t.popular && <div className="text-xs font-semibold text-brand-400 mb-1">Most Popular</div>}
                <h3 className={`font-bold ${t.color}`}>{t.name}</h3>
                <p className="text-xl font-extrabold text-[var(--text)]">{t.price}</p>
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

          <Callout type="info" title="Desktop app:">Download the macOS app for a native experience. It runs in the menu bar, starts on login, and supports on-site Ollama models. See <Link to="/docs/desktop-app" className="text-[var(--cyan)] hover:underline">Desktop App</Link> for details.</Callout>
        </div>
      </section>

      <DocsNav next={{ label: "Features", href: "/docs/features" }} />
    </div>
  )
}