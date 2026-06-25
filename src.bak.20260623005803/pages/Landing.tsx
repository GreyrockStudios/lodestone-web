import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Sparkles, ArrowRight, Download, ChevronRight, Upload, Share2, Zap, ListTodo, MessageSquare, Cpu, Search, Lightbulb } from 'lucide-react'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing-page' }),
      })
      setSubmitted(true)
    } catch {}
  }

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Memory that compounds',
      desc: 'Every conversation teaches your AI. Preferences, commitments, decisions — it all accumulates. No re-explaining yourself ever again.',
      accent: 'brand',
    },
    {
      icon: <ListTodo className="w-6 h-6" />,
      title: 'Tasks that track themselves',
      desc: 'Say "I need to email Sarah by Friday" and it creates a tracked commitment with a due date. Overdue items surface automatically.',
      accent: 'cyan',
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Recall anything instantly',
      desc: 'Type /recall followed by a keyword. Search across memories, commitments, and past conversations. Your brain, searchable.',
      accent: 'brand',
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Upload files, build knowledge',
      desc: 'Drop in PDFs, documents, or text files. Your AI reads them, remembers them, and uses them as context in future conversations.',
      accent: 'cyan',
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Share conversations',
      desc: 'One click creates a shareable link. Show someone an AI breakthrough, a decision analysis, or a brainstorm — no login required.',
      accent: 'brand',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Streaming responses',
      desc: 'Watch the AI think in real-time. No more staring at a loading spinner — responses stream in token by token.',
      accent: 'cyan',
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Smart suggestions',
      desc: 'Time-aware greetings. Overdue task alerts. Conversation templates for weekly reviews, brainstorms, and decisions.',
      accent: 'brand',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: '6 AI providers',
      desc: 'Ollama Cloud (free), Claude, GPT-4o, and more. Switch providers mid-conversation. Bring your own key and pay nothing to us.',
      accent: 'cyan',
    },
  ]

  const steps = [
    { n: '1', title: 'Create your account', desc: 'Sign up free. Give your AI a name and personality. Takes 30 seconds.', color: 'from-brand-500 to-brand-400' },
    { n: '2', title: 'Start talking', desc: 'Type a message or pick a template. Your AI remembers everything from the very first chat.', color: 'from-brand-400 to-cyan-500' },
    { n: '3', title: 'It gets smarter', desc: 'Every conversation adds to your brain. Commitments, preferences, facts — all compound over time.', color: 'from-cyan-500 to-cyan-400' },
  ]

  const templates = [
    { icon: '📋', name: 'Weekly Review', desc: 'Reflect on wins, challenges, and set next week\'s priorities' },
    { icon: '💡', name: 'Brainstorm', desc: 'Open-ended ideation with "yes, and" thinking' },
    { icon: '⚖️', name: 'Decision Framework', desc: 'Structure pros, cons, and second-order effects' },
    { icon: '✉️', name: 'Email Draft', desc: 'Specify recipient, tone, and purpose — get a polished draft' },
    { icon: '☀️', name: 'Daily Brief', desc: 'Pending tasks, follow-ups, and priority suggestions' },
    { icon: '💻', name: 'Code Help', desc: 'Precise, working code examples with explanations' },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <svg width="28" height="28" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
            <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
          </svg>
          <span className="font-extrabold text-[var(--text)] text-lg tracking-tight">Lodestone</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-[var(--text-muted)] text-sm no-underline hover:text-[var(--text)] transition-colors">Features</a>
          <a href="#how-it-works" className="text-[var(--text-muted)] text-sm no-underline hover:text-[var(--text)] transition-colors">How it works</a>
          <a href="#pricing" className="text-[var(--text-muted)] text-sm no-underline hover:text-[var(--text)] transition-colors">Pricing</a>
          <Link to="/docs/getting-started" className="text-[var(--text-muted)] text-sm no-underline hover:text-[var(--text)] transition-colors">Docs</Link>
          <Link to="/login" className="text-[var(--text-muted)] text-sm no-underline hover:text-[var(--text)] transition-colors">Sign in</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold no-underline transition-colors">Get started free</Link>
        </div>
        <Link to="/register" className="md:hidden px-3 py-1.5 rounded-lg bg-brand-500 text-white text-sm font-semibold no-underline">Get started</Link>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Now with memory, tasks, and file uploads
            <ChevronRight className="w-3 h-3" />
          </div>

          <div className="mb-8 flex justify-center">
            <div className="relative">
              <svg width="96" height="96" viewBox="0 0 512 512" className="drop-shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                <defs>
                  <radialGradient id="cg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <rect width="512" height="512" rx="108" fill="#0a0a14"/>
                <circle cx="256" cy="256" r="140" fill="url(#cg)"/>
                <ellipse cx="256" cy="256" rx="210" ry="75" fill="none" stroke="#4c1d95" strokeWidth="1.2" opacity="0.3" transform="rotate(-25,256,256)"/>
                <circle cx="256" cy="256" r="45" fill="#1e1b4b" stroke="#8B5CF6" strokeWidth="3"/>
                <circle cx="256" cy="256" r="25" fill="#8B5CF6" opacity="0.85"/>
                <circle cx="256" cy="256" r="11" fill="#fff" opacity="0.95"/>
              </svg>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            <span className="bg-gradient-to-r from-white via-brand-300 to-cyan-400 bg-clip-text text-transparent">Your AI,</span>
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">Always Learning</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-muted)] mb-4 max-w-xl mx-auto leading-relaxed">
            An AI assistant that remembers your commitments, learns your preferences, and gets smarter every conversation.
          </p>
          <p className="text-sm text-[var(--text-dim)] mb-10">
            Memory · Tasks · File uploads · 6 AI providers · Streaming · Sharing
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-6">
            <Link
              to="/register"
              className="group px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold no-underline transition-all hover:shadow-lg hover:shadow-brand-500/25 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="/downloads"
              className="px-7 py-3.5 rounded-xl border border-[var(--border)] text-[var(--text)] font-medium no-underline hover:bg-[var(--surface)] transition-all hover:border-[var(--text-dim)] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download App
            </a>
          </div>

          <p className="text-xs text-[var(--text-dim)]">macOS · 4 MB download · Community tier free · No credit card required</p>
        </div>

        {/* App screenshot mockup */}
        <div className="relative z-10 mt-10 w-full max-w-4xl mx-auto px-4">
          <div className="rounded-xl overflow-hidden shadow-2xl shadow-brand-500/10 border border-[var(--border)]" style={{ background: 'var(--surface)' }}>
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)]" style={{ background: 'var(--surface-2)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-[var(--text-muted)] ml-2">Lodestone</span>
            </div>
            <div className="flex" style={{ height: 320 }}>
              {/* Sidebar */}
              <div className="w-48 border-r border-[var(--border)] p-3 hidden sm:block" style={{ background: 'var(--bg)' }}>
                <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500" />
                  <span className="text-xs font-medium text-[var(--text)]">Alex</span>
                </div>
                <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium mb-2">
                  <span>+</span> New Chat
                </button>
                <div className="space-y-1 text-xs text-[var(--text-dim)]">
                  <div className="px-2 py-1 rounded">Brainstorm ideas</div>
                  <div className="px-2 py-1 rounded">Email draft for client</div>
                  <div className="px-2 py-1 rounded">Weekly review</div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs text-[var(--text-dim)]">
                    <span>🧠</span> Memory
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-xs text-[var(--text-dim)]">
                    <span>📋</span> Tasks
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 text-xs text-[var(--text-dim)]">
                    <span>⚙️</span> Settings
                  </div>
                </div>
              </div>
              {/* Chat area */}
              <div className="flex-1 p-4 overflow-hidden">
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-brand-500/20">
                    <span className="text-xl">🪨</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text)] mb-1">Good morning ☀️</h3>
                  <p className="text-[10px] text-[var(--text-muted)] mb-2">I remember details about you. What can I help with?</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {["👋 New conversation", "💡 Brainstorm", "📝 Write", "🔧 Code"].map(t => (
                      <span key={t} className="px-2 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[10px] text-[var(--text-muted)]">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-end">
                    <div className="max-w-[70%] px-3 py-1.5 rounded-xl bg-brand-500 text-white text-[11px]">
                      Help me brainstorm landing page ideas
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[70%] px-3 py-1.5 rounded-xl bg-[var(--surface-2)] text-[var(--text)] text-[11px]">
                      Here are 3 approaches that work well: <span className="inline-block w-1 h-3 bg-brand-500 animate-pulse ml-0.5 -mb-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Not just a chatbot.
              <br />
              <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">A life assistant.</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-lg mx-auto">
              Every feature designed to make your AI compound knowledge over time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => (
              <div
                key={f.title}
                className={`group p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/5 ${
                  f.accent === 'cyan' ? 'hover:border-cyan-500/30 hover:shadow-cyan-500/5' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  f.accent === 'cyan'
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'bg-brand-500/10 text-brand-400'
                }`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-[var(--text)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memory & Recall showcase */}
      <section className="py-24 md:py-32 px-4 border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
                Memory that
                <br />
                <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">compounds</span>
              </h2>
              <p className="text-[var(--text-muted)] text-lg mb-6 leading-relaxed">
                Every conversation teaches your AI something new. Preferences, commitments, people, decisions — it all accumulates into a knowledge graph that makes every future conversation smarter.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0 text-sm">🧠</div>
                  <div>
                    <h4 className="font-semibold text-[var(--text)] text-sm">Auto-extracted facts</h4>
                    <p className="text-xs text-[var(--text-muted)]">Your AI automatically stores preferences, commitments, and context from every chat.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 text-sm">🔍</div>
                  <div>
                    <h4 className="font-semibold text-[var(--text)] text-sm">/recall — instant search</h4>
                    <p className="text-xs text-[var(--text-muted)]">Type "/recall preferences" to search everything your agent knows about you.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0 text-sm">📋</div>
                  <div>
                    <h4 className="font-semibold text-[var(--text)] text-sm">Tracked commitments</h4>
                    <p className="text-xs text-[var(--text-muted)]">Say "/task follow up with the client by Friday" and it tracks it with a due date.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory mockup */}
            <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-lg" style={{ background: 'var(--bg)' }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)]" style={{ background: 'var(--surface-2)' }}>
                <span className="text-sm">🧠</span>
                <span className="text-xs font-medium text-[var(--text)]">Memory</span>
                <span className="text-[10px] text-[var(--text-dim)] ml-auto">24 memories</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Personal</span>
                    <span className="text-[10px] text-[var(--text-dim)]">8 facts</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-[var(--text-muted)]">
                    <p>• Based in Vancouver, Canada</p>
                    <p>• Product designer by profession</p>
                    <p>• Prefers concise answers</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Projects</span>
                    <span className="text-[10px] text-[var(--text-dim)]">6 facts</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-[var(--text-muted)]">
                    <p>• Working on product launch (Q3)</p>
                    <p>• Client website redesign — ongoing</p>
                    <p>• Side project — mobile app</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Commitments</span>
                    <span className="text-[10px] text-[var(--text-dim)]">3 tasks</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-[var(--text-muted)]">
                    <p className="flex items-center gap-1"><span className="text-green-400">✓</span> Send proposal to client</p>
                    <p className="flex items-center gap-1"><span className="text-yellow-400">◐</span> Review designs by Friday</p>
                    <p className="flex items-center gap-1"><span className="text-red-400">!</span> Follow up with vendor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates showcase */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Start with a template,
              <br />
              <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">finish with clarity</span>
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-lg mx-auto">
              Built-in conversation templates for structured thinking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(t => (
              <div key={t.name} className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-brand-500/20 transition-colors">
                <div className="text-2xl mb-3">{t.icon}</div>
                <h3 className="font-semibold text-[var(--text)] mb-1">{t.name}</h3>
                <p className="text-sm text-[var(--text-muted)]">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 md:py-32 px-4 border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Smarter with every conversation
            </h2>
            <p className="text-[var(--text-muted)] text-lg">
              No setup. No configuration. Just start talking.
            </p>
          </div>

          <div className="space-y-10">
            {steps.map(s => (
              <div key={s.n} className="flex gap-5 items-start">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-brand-500/20`}>
                  {s.n}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo callouts */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-center">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-2xl font-extrabold text-[var(--text)]">/recall</div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Search your brain instantly</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-center">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-2xl font-extrabold text-[var(--text)]">/task</div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Create tracked commitments</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-center">
              <div className="text-3xl mb-2">📎</div>
              <div className="text-2xl font-extrabold text-[var(--text)]">Upload</div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Drop files, build knowledge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className="py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Start free, upgrade when ready
            </h2>
            <p className="text-[var(--text-muted)] text-lg">
              No credit card required. Usage billed at cost + 5%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Community */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--text-dim)] transition-colors">
              <h3 className="font-bold text-lg mb-1">Community</h3>
              <div className="mb-1">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-[var(--text-dim)] text-sm ml-1">forever</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-6">Your AI brain, always learning</p>
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Desktop app (Mac)</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Unlimited chat</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Memory & knowledge</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Tasks & commitments</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Ollama Cloud models</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> $10/mo usage included</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Bring your own key</li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center py-3 rounded-xl border border-[var(--border)] text-[var(--text)] font-medium no-underline hover:bg-[var(--surface)] transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border-2 border-brand-500 relative shadow-lg shadow-brand-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-white text-xs font-semibold">
                Most Popular
              </div>
              <h3 className="font-bold text-lg mb-1">Pro</h3>
              <div className="mb-1">
                <span className="text-4xl font-extrabold">$29.99</span>
                <span className="text-[var(--text-dim)] text-sm ml-1">/month</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-6">Everything, unlocked</p>
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Everything in Community</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Web + desktop access</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Claude, GPT-4o, o1</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> File uploads & RAG</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Conversation sharing</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Streaming responses</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> $15/mo usage included</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Priority support</li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold no-underline transition-colors shadow-lg shadow-brand-500/20"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Studio */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-cyan-500/30 transition-colors">
              <h3 className="font-bold text-lg mb-1">Studio</h3>
              <div className="mb-1">
                <span className="text-4xl font-extrabold">$79.99</span>
                <span className="text-[var(--text-dim)] text-sm ml-1">/month</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-6">For power users & teams</p>
              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Everything in Pro</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> 5 agent identities</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> API access</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> $40/mo usage included</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Dedicated support</li>
              </ul>
              <Link
                to="/register"
                className="block w-full text-center py-3 rounded-xl border border-cyan-500/50 text-cyan-400 font-medium no-underline hover:bg-cyan-500/10 transition-colors"
              >
                Get Studio
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-[var(--text-dim)] mt-6">
            Need team features or custom deployment? <a href="mailto:hello@heylodestone.com" className="text-brand-400 hover:underline">Contact us</a> for Enterprise.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            Ready to meet your AI?
          </h2>
          <p className="text-[var(--text-muted)] text-lg mb-8">
            Start free. No credit card required. Your AI gets smarter from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link
              to="/register"
              className="group px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold no-underline transition-all hover:shadow-lg hover:shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3.5 rounded-xl border border-[var(--border)] text-[var(--text)] font-medium no-underline hover:bg-[var(--surface)] transition-colors flex items-center justify-center gap-2"
            >
              See all plans
            </Link>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)] mb-3">
              Prefer to wait? Join the <span className="text-brand-400 font-medium">early access</span> list.
            </p>
            {submitted ? (
              <p className="text-green-400 font-medium">&#10003; You are on the list! We will be in touch.</p>
            ) : (
              <form onSubmit={handleWaitlist} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm placeholder:text-[var(--text-dim)] outline-none focus:border-brand-500 transition-colors"
                />
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-2 no-underline mb-3">
                <svg width="24" height="24" viewBox="0 0 512 512">
                  <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
                  <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
                </svg>
                <span className="font-extrabold text-[var(--text)] tracking-tight">Lodestone</span>
              </Link>
              <p className="text-sm text-[var(--text-dim)] max-w-xs">
                Your AI, always learning. Memory, tasks, and knowledge that compound over time.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="font-semibold text-[var(--text)] mb-3">Product</h4>
                <div className="space-y-2">
                  <a href="#features" className="block text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline">Features</a>
                  <Link to="/pricing" className="block text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline">Pricing</Link>
                  <a href="/downloads" className="block text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline">Download</a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text)] mb-3">Resources</h4>
                <div className="space-y-2">
                  <Link to="/docs/getting-started" className="block text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline">Docs</Link>
                  <Link to="/docs/faq" className="block text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline">FAQ</Link>
                  <a href="mailto:hello@heylodestone.com" className="block text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline">Support</a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--text)] mb-3">Legal</h4>
                <div className="space-y-2">
                  <Link to="/terms" className="block text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline">Terms of Service</Link>
                  <Link to="/privacy" className="block text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline">Privacy Policy</Link>
                  <Link to="/eula" className="block text-[var(--text-dim)] hover:text-[var(--text)] transition-colors no-underline">EULA</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-dim)]">
              &copy; {new Date().getFullYear()} <a href="https://greyrockstudios.com" className="text-[var(--text-muted)] hover:text-[var(--text)]">Greyrock Studio</a>. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/GreyrockStudios" target="_blank" className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              </a>
              <a href="#" className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}