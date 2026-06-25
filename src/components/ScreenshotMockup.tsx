// Reusable screenshot mockup component that looks like the real app
// Used across all docs pages for consistent visual representation

export function AppMockup({ children, title = 'Lodestone', className = '' }: { children: React.ReactNode; title?: string; className?: string }) {
  return (
    <div className={`relative rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden shadow-2xl shadow-black/30 my-6 ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 text-center text-xs text-[var(--text-dim)]">{title}</div>
      </div>
      {children}
    </div>
  )
}

export function SidebarMockup({ active = 'chat' }: { active?: string }) {
  const items = [
    { icon: '💬', label: 'Chats', id: 'chat' },
    { icon: '🧠', label: 'Memory', id: 'memory' },
    { icon: '🪪', label: 'Identity', id: 'identity' },
    { icon: '📋', label: 'Tasks', id: 'tasks' },
    { icon: '⚙️', label: 'Settings', id: 'settings' },
  ]
  return (
    <div className="w-48 flex-shrink-0 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col h-full">
      <div className="p-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 px-2">
          <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="font-bold text-sm text-[var(--text)]">Lodestone</span>
        </div>
      </div>
      <div className="p-2">
        <div className="px-2 py-1.5 rounded-lg bg-brand-500/15 text-brand-400 text-xs font-medium mb-1">
          + New Chat
        </div>
      </div>
      <div className="flex-1 px-2 space-y-0.5">
        {items.map(item => (
          <div key={item.id} className={`px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 ${active === item.id ? 'bg-brand-500/15 text-brand-400' : 'text-[var(--text-muted)]'}`}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400 font-bold">A</div>
          <div className="text-xs">
            <div className="text-[var(--text)] font-medium">Admin</div>
            <div className="text-[var(--text-dim)]">Pro</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ChatBubble({ role, text }: { role: 'user' | 'assistant'; text: string }) {
  return (
    <div className={`flex gap-2.5 mb-3 ${role === 'user' ? 'justify-end' : ''}`}>
      {role === 'assistant' && (
        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        </div>
      )}
      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
        role === 'user'
          ? 'bg-brand-500/20 text-[var(--text)]'
          : 'bg-[var(--surface)] text-[var(--text-muted)]'
      }`}>
        {text}
      </div>
      {role === 'user' && (
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1 text-xs text-cyan-400 font-bold">A</div>
      )}
    </div>
  )
}

export function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-brand-500/30 transition-colors">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-bold text-[var(--text)] text-sm mb-1">{title}</h3>
      <p className="text-xs text-[var(--text-muted)]">{desc}</p>
    </div>
  )
}

export function StepNumber({ n }: { n: number }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-brand-500/20">
      {n}
    </div>
  )
}

export function Callout({ type = 'info', title, children }: { type?: 'info' | 'warning' | 'success'; title: string; children: React.ReactNode }) {
  const styles = {
    info: 'bg-brand-500/10 border-brand-500/20 text-brand-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
  }
  return (
    <div className={`p-4 rounded-lg border ${styles[type]} mb-6`}>
      <p className="text-sm text-[var(--text)]">
        <span className="font-semibold">{title}</span>{' '}
        {children}
      </p>
    </div>
  )
}

export function DocsNav({ prev, next }: { prev?: { label: string; href: string }; next?: { label: string; href: string } }) {
  return (
    <div className="flex justify-between pt-8 border-t border-[var(--border)] mt-8">
      {prev ? (
        <a href={prev.href} className="text-[var(--cyan)] hover:underline text-sm font-medium no-underline">
          ← {prev.label}
        </a>
      ) : <span />}
      {next ? (
        <a href={next.href} className="text-[var(--cyan)] hover:underline text-sm font-medium no-underline">
          {next.label} →
        </a>
      ) : <span />}
    </div>
  )
}
