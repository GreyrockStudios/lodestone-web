import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const platforms = [
  {
    name: 'macOS',
    subtitle: 'Apple Silicon (M1/M2/M3/M4)',
    icon: '🍎',
    url: '/downloads/Lodestone_0.3.3_aarch64.dmg?v=7',
    size: '3.8 MB',
    note: 'Native Apple Silicon build. System tray, notifications, auto-launch.',
    badge: 'Download',
  },
  {
    name: 'Windows',
    subtitle: 'Windows 10+ (x64)',
    icon: '🪟',
    url: '/downloads/Lodestone_0.3.3_x64-setup.exe',
    size: '2.6 MB',
    note: 'Requires WebView2 runtime (pre-installed on Windows 11). .MSI also available.',
    badge: 'Download',
    altUrl: '/downloads/Lodestone_0.3.3_x64_en-US.msi',
    altLabel: '.MSI',
  },
  {
    name: 'Linux',
    subtitle: 'Ubuntu 20.04+ (x64)',
    icon: '🐧',
    url: '/downloads/Lodestone_0.3.3_amd64.AppImage',
    size: '78 MB',
    note: 'AppImage — download, chmod +x, run. .deb also available for Debian/Ubuntu.',
    badge: 'Download',
    altUrl: '/downloads/Lodestone_0.3.3_amd64.deb',
    altLabel: '.deb',
  },
]

export default function Downloads() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Download Lodestone</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Alpha — early access build
          </div>
          <p className="text-lg text-[var(--text-muted)]">
            Free to start. No credit card required. Your brain, on your desktop.
          </p>
        </div>

        {/* App screenshot mockup */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-lg" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)]" style={{ background: 'var(--surface-2)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-[var(--text-muted)] ml-2">Lodestone</span>
            </div>
            <div className="flex" style={{ height: 280 }}>
              <div className="w-44 border-r border-[var(--border)] p-3 hidden sm:block" style={{ background: 'var(--bg)' }}>
                <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500" />
                  <span className="text-[10px] font-medium text-[var(--text)]">Alex</span>
                </div>
                <button className="w-full flex items-center gap-1.5 px-2 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-[10px] font-medium mb-2">
                  <span>+</span> New Chat
                </button>
                <div className="space-y-0.5 text-[10px] text-[var(--text-dim)]">
                  <div className="px-2 py-1 rounded hover:bg-[var(--surface)]">Brainstorm ideas</div>
                  <div className="px-2 py-1 rounded hover:bg-[var(--surface)]">Email draft</div>
                  <div className="px-2 py-1 rounded hover:bg-[var(--surface)]">Weekly review</div>
                </div>
                <div className="mt-3 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-[var(--text-dim)]">
                    <span>🧠</span> Memory
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-[var(--text-dim)]">
                    <span>📋</span> Tasks
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-brand-500/20">
                    <span className="text-lg">🪨</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text)] mb-1">Good morning ☀️</h3>
                  <p className="text-[10px] text-[var(--text-muted)] mb-2">I remember details about you. What can I help with?</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {["👋 Chat", "💡 Brainstorm", "📝 Write", "🔧 Code"].map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[9px] text-[var(--text-muted)]">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-2 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[10px] text-[var(--text-dim)]">
                      Type a message...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alpha notice */}
        <div className="p-5 rounded-lg bg-yellow-500/5 border border-yellow-500/20 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-400 text-sm mb-1">Alpha release</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                This is an early access build. Things may break, features may change, and data formats may not be final.
                The app is not yet code-signed — you'll see a Gatekeeper/SmartScreen warning on first launch.
                <strong className="text-[var(--text)]"> Right-click → Open</strong> on macOS, or <strong className="text-[var(--text)]">More info → Run anyway</strong> on Windows.
              </p>
            </div>
          </div>
        </div>

        {/* Platform downloads */}
        <div className="space-y-4 mb-8">
          {platforms.map(p => (
            <div key={p.name} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex items-center justify-between hover:border-brand-500/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{p.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    {p.url && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                        v0.3.3-alpha
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{p.subtitle} · {p.size}</p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">{p.note}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {p.url ? (
                  <a
                    href={p.url}
                    className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm no-underline transition-colors whitespace-nowrap"
                  >
                    Download
                  </a>
                ) : (
                  <span className="px-5 py-2.5 rounded-lg bg-[var(--surface-2)] text-[var(--text-dim)] font-medium text-sm whitespace-nowrap border border-[var(--border)]">
                    Coming soon
                  </span>
                )}
                {p.altUrl && (
                  <a href={p.altUrl} className="text-xs text-[var(--text-dim)] hover:text-[var(--text)] no-underline">
                    Also available: {p.altLabel}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Why so small */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-2 text-sm">Why so small?</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Lodestone uses your operating system's built-in browser engine — no bundled Chromium.
              The macOS app is <strong className="text-[var(--text)]">3.8 MB</strong>, Windows is <strong className="text-[var(--text)]">2.6 MB</strong>.
              That's 10–50x smaller than Electron apps.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-2 text-sm">First time?</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              <strong className="text-[var(--text)]">macOS:</strong> Right-click the app → Open → Open again. Normal for unsigned alpha apps.
              <br />
              <strong className="text-[var(--text)]">Windows:</strong> Click "More info" → "Run anyway" when SmartScreen warns.
              <br />
              <strong className="text-[var(--text)]">Linux:</strong> <code className="text-xs bg-[var(--surface-2)] px-1 py-0.5 rounded">chmod +x</code> the AppImage, then double-click to run.
              <br />
              Code signing coming soon.
            </p>
          </div>
        </div>

        {/* What's new */}
        <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--border)] mb-6">
          <h3 className="font-semibold text-[var(--text)] mb-3 text-sm">What's new in v0.3.3-alpha</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-[var(--text-muted)]">
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Native notifications & dock badges</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Overlay title bar, native menus</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Keyboard shortcuts — Cmd+W, Cmd+Q</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Check for Updates in the menu</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span> 3.8 MB download (Tauri 2, not Electron)</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Streaming responses (SSE)</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span> File uploads with auto-extraction</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Conversation sharing via link</div>
          </div>
        </div>

        {/* Desktop features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
            <div className="text-2xl mb-2">🖥️</div>
            <h4 className="font-semibold text-[var(--text)] text-sm mb-1">Always on</h4>
            <p className="text-xs text-[var(--text-muted)]">Runs in the menu bar. Your agent is ready the moment you need it.</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="font-semibold text-[var(--text)] text-sm mb-1">Fully private</h4>
            <p className="text-xs text-[var(--text-muted)]">Run Ollama locally — your conversations never leave your machine.</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
            <div className="text-2xl mb-2">🦙</div>
            <h4 className="font-semibold text-[var(--text)] text-sm mb-1">On-site Ollama</h4>
            <p className="text-xs text-[var(--text-muted)]">No API key needed. Run Llama, Mistral, Qwen, and more locally.</p>
          </div>
        </div>

        <div className="text-center text-sm text-[var(--text-dim)]">
          <p>By downloading, you agree to our <a href="/terms" className="text-brand-400 no-underline hover:underline">Terms of Service</a> and <a href="/privacy" className="text-brand-400 no-underline hover:underline">Privacy Policy</a>.</p>
          <p className="mt-1">v0.3.3-alpha · June 22, 2026</p>
        </div>
      </div>
    </div>
  )
}