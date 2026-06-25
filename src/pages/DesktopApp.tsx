import { Link } from 'react-router-dom'
import { AppMockup, SidebarMockup, Callout, DocsNav } from '../components/ScreenshotMockup'

export default function DesktopApp() {
  return (
    <div className="docs-content max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Desktop App</h1>
      <p className="text-[var(--text-muted)] text-lg mb-10">Download, install, and set up Lodestone on your Mac or PC. Your AI, always on, always local.</p>

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

      {/* Why Desktop */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Why the desktop app?</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            The desktop app gives you everything the web version offers, plus:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "🖥️", title: "Always on", desc: "Runs in the system tray. Your agent is ready the moment you need it." },
              { icon: "🔒", title: "Fully private", desc: "Run Ollama locally — your conversations never leave your machine." },
              { icon: "🦙", title: "On-site Ollama", desc: "No API key needed. Run Llama, Mistral, Qwen, and more locally." },
              { icon: "🔔", title: "Proactive alerts", desc: "Native notifications for tasks, reminders, and completed work." },
              { icon: "📁", title: "File access", desc: "Controlled file system access for reading and writing local files." },
              { icon: "⏱️", title: "Scheduled tasks", desc: "Set up recurring tasks that run automatically on a schedule." },
              { icon: "🪪", title: "Personas", desc: "Create and switch between multiple agent identities." },
              { icon: "🔄", title: "Cloud sync", desc: "Pro & Studio: auto-sync conversations and memories across devices every 5 minutes." },
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

      {/* System requirements */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">System requirements</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <p className="font-semibold text-[var(--text)] mb-2">🍎 macOS (minimum)</p>
              <ul className="text-sm text-[var(--text-muted)] space-y-1">
                <li>macOS 13 (Ventura) or later</li>
                <li>Apple Silicon (M1+) or Intel (x86_64)</li>
                <li>4 GB RAM minimum, 8 GB recommended</li>
                <li>~190 MB disk space for the app</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <p className="font-semibold text-[var(--text)] mb-2">🪟 Windows (minimum)</p>
              <ul className="text-sm text-[var(--text-muted)] space-y-1">
                <li>Windows 10 or later (x64)</li>
                <li>4 GB RAM minimum, 8 GB recommended</li>
                <li>~93 MB disk space for the installer</li>
                <li>Internet connection for cloud models</li>
              </ul>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <p className="font-semibold text-[var(--text)] mb-2">For local models (Ollama)</p>
            <ul className="text-sm text-[var(--text-muted)] space-y-1">
              <li>8 GB RAM minimum for 7B models</li>
              <li>16 GB RAM for 13B+ models</li>
              <li>Apple Silicon or dedicated GPU recommended</li>
              <li>2–10 GB additional disk per model</li>
            </ul>
          </div>
        </div>
        <Callout type="info" title="Note:">The desktop app is built with Electron. macOS downloads are ~190 MB and Windows downloads are ~93 MB. This is larger than the original Tauri prototype but provides better cross-platform compatibility and Windows support.</Callout>
      </section>

      {/* Download */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Download</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>Download the latest release for your platform:</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/downloads"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm no-underline transition-colors"
            >
              <span>🍎</span> Download for macOS
            </a>
            <a
              href="/downloads"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)] font-semibold text-sm no-underline transition-colors"
            >
              <span>🪟</span> Download for Windows
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-center">
              <p className="text-2xl font-extrabold text-brand-400">~190 MB</p>
              <p className="text-xs text-[var(--text-dim)]">macOS download</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-center">
              <p className="text-2xl font-extrabold text-brand-400">~93 MB</p>
              <p className="text-xs text-[var(--text-dim)]">Windows download</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-center">
              <p className="text-2xl font-extrabold text-green-400">Free</p>
              <p className="text-xs text-[var(--text-dim)]">All tiers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Installation</h2>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">macOS</h3>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed mb-8">
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
                  <h4 className="font-semibold text-[var(--text)] mb-0.5">{s.title}</h4>
                  <p className="text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Callout type="warning" title="Gatekeeper note:">If macOS blocks the app because it is from an "unidentified developer," go to <strong>System Settings → Privacy & Security</strong> and click <strong>Open Anyway</strong>. This is normal for apps not distributed through the Mac App Store.</Callout>
        </div>

        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">Windows</h3>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <div className="space-y-4">
            {[
              { step: '1', title: 'Run the installer', desc: 'Double-click the downloaded .exe file. Windows SmartScreen may show a warning — click "More info" then "Run anyway".' },
              { step: '2', title: 'Follow the setup wizard', desc: 'Choose your install location and preferences. The installer will set up the app and create Start Menu shortcuts.' },
              { step: '3', title: 'Launch Lodestone', desc: 'Open from the Start Menu or desktop shortcut. The app will appear in your system tray.' },
              { step: '4', title: 'Sign in or create account', desc: 'Log in with your existing account or create a new one. Your settings sync across devices.' },
            ].map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-brand-500/20">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text)] mb-0.5">{s.title}</h4>
                  <p className="text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Callout type="info" title="SmartScreen:">Windows SmartScreen may warn that the app is unrecognized. This is expected for new software without extended code signing. Click "More info" → "Run anyway." Full code signing is coming soon.</Callout>
        </div>
      </section>

      {/* Onboarding */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">First-run onboarding</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>When you first open the desktop app, you'll walk through 7 quick setup steps:</p>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Welcome', desc: 'Introduction to Lodestone and what it can do.' },
              { step: '2', title: 'Model Selection', desc: 'Choose your default AI provider: Ollama Cloud (free), Local Ollama, Claude, GPT-4o, or GLM Cloud.' },
              { step: '3', title: 'Ollama Detect', desc: 'The app checks for a local Ollama installation. If not found, it offers to install it for you and lists available models.' },
              { step: '4', title: 'Personality', desc: 'Pick your agent\'s personality: Friendly, Professional, Creative, or Precise.' },
              { step: '5', title: 'Privacy', desc: 'Choose your file access tier: None, Minimal, Standard, or Full.' },
              { step: '6', title: 'Theme', desc: 'Select Dark, Light, or System theme.' },
              { step: '7', title: 'Ready', desc: 'You\'re all set — start chatting!' },
            ].map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-brand-500/20">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text)] mb-0.5">{s.title}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Command Palette */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Command Palette</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            Press <kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm font-mono">Cmd+K</kbd> (Mac) or <kbd className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm font-mono">Ctrl+K</kbd> (Windows) to open the command palette. Quickly access any feature without leaving the keyboard:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { cmd: "New Chat", desc: "Start a fresh conversation" },
              { cmd: "Search", desc: "Search conversations and memories" },
              { cmd: "Export", desc: "Export chat as MD, JSON, or PDF" },
              { cmd: "Recall Memory", desc: "Search your knowledge graph" },
              { cmd: "Set Reminder", desc: "Create a timed reminder" },
              { cmd: "Theme", desc: "Switch dark/light/system theme" },
              { cmd: "Settings", desc: "Open app settings" },
              { cmd: "Account", desc: "Manage your account & billing" },
            ].map(item => (
              <div key={item.cmd} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-sm font-medium text-[var(--text)]">{item.cmd}</span>
                <span className="text-xs text-[var(--text-dim)]">— {item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* File Access Tiers */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">File Access Tiers</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            The desktop app can access local files, but you control exactly how much. Choose a file access tier in <strong>Settings → Desktop → File Access</strong>:
          </p>
          <div className="space-y-3">
            {[
              { icon: "🔒", level: "No Access", desc: "The agent cannot read or write any files. Maximum privacy.", color: "text-red-400" },
              { icon: "👁️", level: "Minimal", desc: "Read-only access to Desktop, Documents, and Downloads folders.", color: "text-yellow-400" },
              { icon: "📂", level: "Standard", desc: "Read/write your home folder. Blocks .ssh, .gnupg, .keychain. Default.", color: "text-green-400" },
              { icon: "🔓", level: "Full Access", desc: "Full filesystem access. Blocks only .ssh, .gnupg, .keychain, .lodestone. Use with caution.", color: "text-brand-400" },
            ].map(t => (
              <div key={t.level} className="flex items-start gap-3 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-xl">{t.icon}</span>
                <div>
                  <p className={`font-semibold ${t.color}`}>{t.level}</p>
                  <p className="text-sm text-[var(--text-muted)]">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Callout type="warning" title="Security:">Even at Full Access, Lodestone never reads .ssh, .gnupg, .keychain, or .lodestone directories. Your private keys and credentials are always protected.</Callout>
        </div>
      </section>

      {/* On-site Ollama */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">On-site Ollama</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            On-site Ollama is the easiest way to run AI models privately on your computer. Lodestone handles the entire lifecycle:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-[var(--text)]">Auto-install.</strong> If Ollama isn't installed, Lodestone downloads and sets it up in the background.</li>
            <li><strong className="text-[var(--text)]">Model management.</strong> Browse and download models from the Ollama library directly in the app. One click to install.</li>
            <li><strong className="text-[var(--text)]">Background service.</strong> Ollama runs as a background process. Your agent starts instantly.</li>
            <li><strong className="text-[var(--text)]">Hardware-aware.</strong> Lodestone detects your RAM and recommends models that will actually run well.</li>
            <li><strong className="text-[var(--text)]">Resource management.</strong> Ollama automatically unloads models after 5 minutes of idle time to save memory.</li>
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

      {/* System tray & background */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">System tray & background behavior</h2>
        <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
          <p>
            The desktop app runs in your system tray so your agent is always available:
          </p>

          {/* System tray mockup */}
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
            <li><strong className="text-[var(--text)]">System tray icon.</strong> When running in the background, Lodestone shows a 🪨 icon in the system tray. Click it to open the chat or check agent status.</li>
            <li><strong className="text-[var(--text)]">Proactive notifications.</strong> Your agent sends native notifications for reminders, completed tasks, and things it thinks you should know.</li>
            <li><strong className="text-[var(--text)]">Auto-start on login.</strong> Enable in Settings → Desktop → "Start Lodestone when I log in." Off by default.</li>
            <li><strong className="text-[var(--text)]">Resource management.</strong> When idle, Lodestone uses minimal CPU and memory. Ollama unloads models after 5 minutes of inactivity.</li>
          </ul>

          <h3 className="text-lg font-semibold text-[var(--text)] mt-6">Keyboard shortcuts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { keys: "Cmd+K / Ctrl+K", desc: "Open command palette" },
              { keys: "Cmd+Shift+S", desc: "Toggle sidebar" },
              { keys: "Cmd+= / Cmd+-", desc: "Increase / decrease font size" },
            ].map(s => (
              <div key={s.keys} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <kbd className="px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] font-mono">{s.keys}</kbd>
                <span className="text-xs text-[var(--text-muted)]">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Web vs Desktop */}
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
                { feature: "Personas & custom instructions", web: "✓", desktop: "✓" },
                { feature: "Voice input & TTS", web: "✓", desktop: "✓" },
                { feature: "Command palette", web: "✓", desktop: "✓" },
                { feature: "BYOK (any provider)", web: "✓", desktop: "✓" },
                { feature: "On-site Ollama", web: "—", desktop: "✓" },
                { feature: "System tray / always on", web: "—", desktop: "✓" },
                { feature: "Auto-start on login", web: "—", desktop: "✓" },
                { feature: "Native notifications", web: "—", desktop: "✓" },
                { feature: "File access tiers", web: "—", desktop: "✓" },
                { feature: "Scheduled tasks", web: "—", desktop: "✓" },
                { feature: "Audit log", web: "—", desktop: "✓" },
                { feature: "Sub-agents", web: "—", desktop: "✓" },
                { feature: "Cloud sync", web: "—", desktop: "✓" },
                { feature: "Offline mode", web: "—", desktop: "✓" },
                { feature: "Browser automation", web: "—", desktop: "✓" },
                { feature: "MCP server connections", web: "—", desktop: "✓" },
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
        <Callout type="info" title="Note:">The web app currently redirects to this docs site — full chat requires the desktop app. Web chat is available on Pro and Studio tiers.</Callout>
      </section>

      <DocsNav prev={{ label: "Features", href: "/docs/features" }} next={{ label: "Usage Guide", href: "/docs/usage-guide" }} />
    </div>
  )
}
