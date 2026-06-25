import { Link } from 'react-router-dom'
import { AppMockup, SidebarMockup, Callout, DocsNav } from '../components/ScreenshotMockup'

export default function DesktopApp() {
  return (
    <div className="docs-content max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Desktop App</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10">Download, install, and set up Lodestone on your Mac. Your AI, always on, always local.</p>

      {/* App mockup — menu bar */}
      <AppMockup title="Lodestone — Desktop">
        <div className="flex" style={{ height: 380 }}>
          <SidebarMockup active="chat" />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-hidden">
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/20">
                  <span className="text-2xl">🪨</span>
                </div>
                <h2 className="text-lg font-bold text-[var(--text)] mb-1">Good evening, Alex</h2>
                <p className="text-xs text-[var(--text-muted)] mb-3">I remember details about you. What can I help with?</p>
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {["👋 Start a conversation", "💡 Brainstorm", "📝 Write", "🔧 Code"].map(t => (
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
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Why the desktop app?</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            The desktop app gives you everything the web version offers, plus:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "🖥️", title: "Always on", desc: "Runs in the menu bar. Your agent is ready the moment you need it." },
              { icon: "🔒", title: "Fully private", desc: "Run Ollama locally — your conversations never leave your machine." },
              { icon: "🦙", title: "On-site Ollama", desc: "No API key needed. Run Llama, Mistral, Qwen, and more locally." },
              { icon: "🔔", title: "Proactive alerts", desc: "Notifications for tasks, reminders, and completed work." },
            ].map(f => (
              <div key={f.title} className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-1">
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
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">System requirements</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <p className="font-semibold text-[var(--text)] mb-2">macOS (minimum)</p>
              <ul className="text-sm text-[var(--text-muted)] space-y-1">
                <li>macOS 13 (Ventura) or later</li>
                <li>Apple Silicon (M1+) or Intel (x86_64)</li>
                <li>4 GB RAM minimum, 8 GB recommended</li>
                <li>500 MB disk space for the app</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <p className="font-semibold text-[var(--text)] mb-2">For local models</p>
              <ul className="text-sm text-[var(--text-muted)] space-y-1">
                <li>8 GB RAM minimum for 7B models</li>
                <li>16 GB RAM for 13B+ models</li>
                <li>Apple Silicon recommended (GPU acceleration)</li>
                <li>2–10 GB additional disk per model</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Download</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>Download the latest release for macOS — just 4 MB, no Electron bloat.</p>
          <div className="flex gap-3">
            <a
              href="/downloads"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm no-underline transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download for macOS
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-center">
              <p className="text-2xl font-extrabold text-brand-400">4 MB</p>
              <p className="text-xs text-[var(--text-dim)]">Download size</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-center">
              <p className="text-2xl font-extrabold text-cyan-400">Tauri</p>
              <p className="text-xs text-[var(--text-dim)]">Native runtime</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-center">
              <p className="text-2xl font-extrabold text-green-400">Free</p>
              <p className="text-xs text-[var(--text-dim)]">All tiers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Installation</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <div className="space-y-4">
            {[
              { step: '1', title: 'Open the DMG', desc: 'Double-click the downloaded .dmg file. A Finder window opens with the Lodestone app icon.' },
              { step: '2', title: 'Drag to Applications', desc: 'Drag the Lodestone icon to the Applications folder shortcut. This copies the app to /Applications/Lodestone.app.' },
              { step: '3', title: 'Launch the app', desc: 'Open it from Applications (or Spotlight). On first launch, macOS may ask you to confirm opening an app downloaded from the internet — click Open.' },
              { step: '4', title: 'Sign in or create account', desc: 'Log in with your existing account or create a new one. Your settings and conversations sync automatically.' },
            ].map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-brand-500/20">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)] mb-0.5">{s.title}</h3>
                  <p className="text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Callout type="warning" title="Gatekeeper note:">If macOS blocks the app because it is from an "unidentified developer," go to <strong>System Settings → Privacy & Security</strong> and click <strong>Open Anyway</strong>. This is normal for apps not distributed through the Mac App Store.</Callout>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">On-site Ollama</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            On-site Ollama is the easiest way to run AI models privately on your Mac. Lodestone handles the entire lifecycle:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-[var(--text)]">Auto-install.</strong> If Ollama isn't installed, Lodestone downloads and sets it up in the background.</li>
            <li><strong className="text-[var(--text)]">Model management.</strong> Browse and download models from the Ollama library directly in the app. One click to install.</li>
            <li><strong className="text-[var(--text)]">Background service.</strong> Ollama runs as a background process. Your agent starts instantly.</li>
            <li><strong className="text-[var(--text)]">Hardware-aware.</strong> Lodestone detects your RAM and recommends models that will actually run well.</li>
          </ul>

          {/* Model recommendation table */}
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] mb-3">Recommended models by RAM</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 text-[var(--text-dim)] font-medium">RAM</th>
                  <th className="text-left py-2 text-[var(--text-dim)] font-medium">Model</th>
                  <th className="text-left py-2 text-[var(--text-dim)] font-medium">Size</th>
                  <th className="text-left py-2 text-[var(--text-dim)] font-medium">Speed</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 text-[var(--text)]">8 GB</td>
                  <td className="py-2 text-[var(--text)]">Llama 3.1 8B</td>
                  <td className="py-2 text-[var(--text-muted)]">~4.7 GB</td>
                  <td className="py-2 text-green-400">Fast</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 text-[var(--text)]">16 GB</td>
                  <td className="py-2 text-[var(--text)]">Mistral Nemo 12B</td>
                  <td className="py-2 text-[var(--text-muted)]">~7.2 GB</td>
                  <td className="py-2 text-green-400">Fast</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 text-[var(--text)]">32 GB</td>
                  <td className="py-2 text-[var(--text)]">Llama 3.1 70B (4-bit)</td>
                  <td className="py-2 text-[var(--text-muted)]">~40 GB</td>
                  <td className="py-2 text-yellow-400">Moderate</td>
                </tr>
                <tr>
                  <td className="py-2 text-[var(--text)]">64 GB+</td>
                  <td className="py-2 text-[var(--text)]">Command R+ 104B (4-bit)</td>
                  <td className="py-2 text-[var(--text-muted)]">~60 GB</td>
                  <td className="py-2 text-yellow-400">Moderate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Menu bar & background behavior</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            The desktop app runs in your menu bar so your agent is always available:
          </p>

          {/* Menu bar mockup */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg)] rounded-lg">
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-xs text-[var(--text)]">🪨</span>
                <span className="text-xs text-[var(--text-muted)]">12:00</span>
              </div>
            </div>
          </div>

          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-[var(--text)]">Menu bar icon.</strong> When running in the background, Lodestone shows a 🪨 icon in the menu bar. Click it to open the chat or check agent status.</li>
            <li><strong className="text-[var(--text)]">Proactive notifications.</strong> Your agent can send you macOS notifications for reminders, completed tasks, and things it thinks you should know.</li>
            <li><strong className="text-[var(--text)]">Auto-start on login.</strong> Enable in Settings → General → "Start Lodestone when I log in." Off by default.</li>
            <li><strong className="text-[var(--text)]">Resource management.</strong> When idle, Lodestone uses minimal CPU and memory. Ollama unloads models after 5 minutes of inactivity.</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Web vs Desktop</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 pr-4 text-[var(--text-dim)] font-medium">Feature</th>
                <th className="text-center py-3 px-3 text-[var(--text-dim)] font-medium">Web</th>
                <th className="text-center py-3 px-3 text-brand-400 font-semibold">Desktop</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Chat & memory", web: "✓", desktop: "✓" },
                { feature: "/recall search", web: "✓", desktop: "✓" },
                { feature: "Tasks & commitments", web: "✓", desktop: "✓" },
                { feature: "Streaming responses", web: "✓", desktop: "✓" },
                { feature: "Smart greeting", web: "✓", desktop: "✓" },
                { feature: "File uploads", web: "✓", desktop: "✓" },
                { feature: "Conversation sharing", web: "✓", desktop: "✓" },
                { feature: "On-site Ollama", web: "—", desktop: "✓" },
                { feature: "Menu bar / always on", web: "—", desktop: "✓" },
                { feature: "Auto-start on login", web: "—", desktop: "✓" },
                { feature: "Native notifications", web: "—", desktop: "✓" },
                { feature: "Offline mode", web: "—", desktop: "✓" },
                { feature: "BYOK (any provider)", web: "✓", desktop: "✓" },
              ].map(row => (
                <tr key={row.feature} className="border-b border-[var(--border)]">
                  <td className="py-2.5 pr-4 text-[var(--text)]">{row.feature}</td>
                  <td className="text-center py-2.5 px-3 text-[var(--text-muted)]">{row.web}</td>
                  <td className="text-center py-2.5 px-3 text-brand-400">{row.desktop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DocsNav prev={{ label: "Features", href: "/docs/features" }} next={{ label: "API Reference", href: "/docs/api" }} />
    </div>
  )
}