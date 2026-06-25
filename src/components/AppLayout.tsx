import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAdmin } from '../hooks/useAdmin'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth()
  const { isAdmin } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  const navItems = [
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/memory', label: 'Memory', icon: '🕸️' },
    { path: '/brain', label: 'Brain', icon: '🧠' },
    { path: '/marketplace', label: 'Marketplace', icon: '🧩' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/')
  }, [logout, navigate])

  const currentPath = location.pathname

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {/* Left Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col flex-shrink-0
          border-r border-[var(--border)] bg-[var(--surface)]
          transition-all duration-200 ease-in-out
          ${sidebarCollapsed ? 'w-[60px]' : 'w-[200px]'}
        `}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-[var(--border)] min-h-[56px]">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2.5 no-underline flex-shrink-0"
            title="Lodestone"
          >
            <svg width="24" height="24" viewBox="0 0 512 512" className="flex-shrink-0">
              <circle cx="256" cy="256" r="22" fill="#8B5CF6" opacity="0.85"/>
              <circle cx="256" cy="256" r="10" fill="#fff" opacity="0.95"/>
            </svg>
            <span className={`font-bold text-lg text-[var(--text)] transition-all duration-150 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              Lodestone
            </span>
          </button>
        </div>

        {/* New Chat */}
        <div className="px-2 pt-3 pb-2">
          <button
            onClick={() => navigate('/chat')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="New Chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className={`transition-all duration-150 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              New Chat
            </span>
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 px-2 py-2 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPath.startsWith(item.path)
                  ? 'bg-brand-500/10 text-brand-400 font-medium'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
              title={item.label}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span className={`transition-all duration-150 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                {item.label}
              </span>
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
              title="Admin"
            >
              <span className="text-base flex-shrink-0">🛡️</span>
              <span className={`transition-all duration-150 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                Admin
              </span>
            </button>
          )}
        </div>

        {/* User section */}
        <div className="border-t border-[var(--border)] px-3 py-2.5">
          <div className={`flex items-center gap-2.5 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-sm font-bold flex-shrink-0">
              {user?.displayName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-150 overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              <p className="text-sm font-medium text-[var(--text)] truncate">{user?.displayName}</p>
              <p className="text-xs text-[var(--text-dim)]">{user?.tier || 'community'}</p>
            </div>
            <button
              onClick={handleLogout}
              className={`text-[var(--text-dim)] hover:text-[var(--danger)] transition-colors flex-shrink-0 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : ''}`}
              title="Sign out"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
