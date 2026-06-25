import { useNavigate } from 'react-router-dom'

const features = [
  { icon: '🦙', title: 'Local AI with Ollama', desc: 'Run models privately on your machine. No cloud, no data leaks, no limits.' },
  { icon: '🔒', title: 'Privacy-first', desc: 'Your conversations stay on your computer. Cloud sync is optional and encrypted.' },
  { icon: '⚡', title: 'Blazing fast', desc: 'Native desktop app — no browser overhead. Local models respond instantly.' },
  { icon: '📁', title: 'File access', desc: 'Read, write, and organize files directly. Your AI actually uses your code and docs.' },
  { icon: '🧠', title: 'Memory & commitments', desc: 'Lodestone remembers what matters. Set reminders, track follow-ups, build knowledge.' },
  { icon: '🖥️', title: '13 desktop tools', desc: 'Screenshot, clipboard, volume, system info, commands, and more — all native.' },
]

export default function DesktopOnly() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Header */}
      <nav className="px-6 md:px-10 py-4 flex items-center justify-between border-b border-[var(--border)]">
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <svg width="28" height="28" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85" />
            <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95" />
          </svg>
          <span className="font-extrabold text-[var(--text)] text-lg tracking-tight">Lodestone</span>
        </a>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-[var(--text-muted)] text-sm no-underline hover:text-[var(--text)] transition-colors">Sign in</a>
          <a href="/downloads" className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium no-underline transition-colors">Download</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="text-7xl mb-6">🪨</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Your AI, <span className="text-brand-400">on your desktop</span>
        </h1>
        <p className="text-lg text-[var(--text-muted)] mb-8 max-w-2xl mx-auto">
          Lodestone is a native desktop app that runs AI locally with Ollama or connects to cloud models.
          Your data stays private on your machine — cloud sync is optional.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
          <a href="/downloads"
            className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-base no-underline transition-colors shadow-lg shadow-brand-500/20">
            Download for Mac →
          </a>
          <a href="/pricing"
            className="px-8 py-3.5 rounded-xl border border-[var(--border)] text-[var(--text)] font-medium text-base no-underline hover:bg-[var(--surface-2)] transition-colors">
            See plans
          </a>
        </div>
        <p className="text-sm text-[var(--text-dim)]">Free tier available · No credit card required · Universal binary</p>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-brand-500/30 transition-colors">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-[var(--text)] mb-1">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Choose your plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-1">Community</h3>
            <p className="text-3xl font-bold mb-1">$0</p>
            <p className="text-sm text-[var(--text-dim)] mb-4">Free forever</p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>✓ Local Ollama models</li>
              <li>✓ Local storage only</li>
              <li>✓ 13 desktop tools</li>
              <li>✓ Scheduler & reminders</li>
              <li className="text-[var(--text-dim)]">✗ Cloud models</li>
              <li className="text-[var(--text-dim)]">✗ Cloud sync</li>
            </ul>
          </div>
          <div className="bg-[var(--surface)] border-2 border-brand-500 rounded-xl p-6 relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-white text-xs font-bold">Popular</span>
            <h3 className="font-semibold text-lg mb-1">Pro</h3>
            <p className="text-3xl font-bold mb-1">$10<span className="text-base font-normal text-[var(--text-dim)]">/mo</span></p>
            <p className="text-sm text-[var(--text-dim)] mb-4">Power users</p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>✓ Everything in Community</li>
              <li>✓ Claude, ChatGPT, Ollama Cloud</li>
              <li>✓ Cloud sync across devices</li>
              <li>✓ $10 credits/month</li>
              <li>✓ Priority support</li>
              <li>✓ API access</li>
            </ul>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-1">Studio</h3>
            <p className="text-3xl font-bold mb-1">$30<span className="text-base font-normal text-[var(--text-dim)]">/mo</span></p>
            <p className="text-sm text-[var(--text-dim)] mb-4">Teams & agencies</p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>✓ Everything in Pro</li>
              <li>✓ Multi-agent workflows</li>
              <li>✓ Team sharing</li>
              <li>✓ $30 credits/month</li>
              <li>✓ Custom models</li>
              <li>✓ Dedicated support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-[var(--border)] py-12 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-[var(--text-muted)] mb-6">Download the app and start chatting in under a minute.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/downloads"
            className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold no-underline transition-colors">
            Download Lodestone →
          </a>
          <button onClick={() => navigate('/login')}
            className="px-8 py-3.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] font-medium hover:bg-[var(--surface-2)] transition-colors">
            Sign in to your account
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--text-dim)]">
        <p>© 2025 Lodestone · <a href="/terms" className="text-[var(--text-muted)] no-underline hover:underline">Terms</a> · <a href="/privacy" className="text-[var(--text-muted)] no-underline hover:underline">Privacy</a></p>
      </div>
    </div>
  )
}