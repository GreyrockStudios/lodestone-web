import * as Sentry from "@sentry/react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import AppShell from "./components/AppShell"
import Settings from "./pages/Settings"
import MemoryPage from "./pages/Memory"
import Account from "./pages/Account"
import Brain from "./pages/Brain"
import Memory from "./pages/Memory"
import AppLayout from "./components/AppLayout"
import AdminGuard from "./components/AdminGuard"
import AdminLayout from "./components/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminPromo from "./pages/admin/AdminPromo"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Pricing from "./pages/Pricing"
import Compare from "./pages/Compare"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import Eula from "./pages/Eula"
import DocsLayout from "./pages/DocsLayout"
import GettingStarted from "./pages/GettingStarted"
import Onboarding from "./pages/Onboarding"
import Features from "./pages/Features"
import DesktopApp from "./pages/DesktopApp"
import ApiReference from "./pages/ApiReference"
import Faq from "./pages/Faq"
import UsageGuide from "./pages/UsageGuide"
import NotFound from "./pages/NotFound"
import Downloads from "./pages/Downloads"
import Changelog from "./pages/Changelog"
import EarlyAccess from "./pages/EarlyAccess"
import SharedChat from "./pages/SharedChat"
import MCPMarketplace from "./pages/MCPMarketplace"
import { ForgotPasswordForm, ResetPasswordForm } from "./components/PasswordReset"
import OAuthCallback from "./pages/OAuthCallback"
import DesktopOnly from "./pages/DesktopOnly"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "",
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
})

// Desktop detection: Tauri (v1/v2) or Electron
const isDesktop = typeof window !== "undefined" && (!!(window as any).__TAURI__ || !!(window as any).__TAURI_INTERNALS__ || !!(window as any).electronAPI)

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-4">
          <svg width="48" height="48" viewBox="0 0 512 512" className="animate-pulse">
            <circle cx="256" cy="256" r="40" fill="#8B5CF6" opacity="0.8" />
            <circle cx="256" cy="256" r="20" fill="#fff" opacity="0.9" />
          </svg>
          <p className="text-[var(--text-muted)] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Desktop app: full app experience */}
      {isDesktop ? (
        <>
          <Route path="/" element={user ? <Navigate to="/chat" replace /> : <Login />} />
          <Route path="/login" element={user ? <Navigate to="/chat" replace /> : <Login />} />
          <Route path="/onboarding" element={user ? <Navigate to="/chat" replace /> : <Onboarding />} />
          <Route path="/register" element={user ? <Navigate to="/chat" replace /> : <Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/share/:token" element={<SharedChat />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/brain" element={<AppLayout><Brain /></AppLayout>} />
          {user && (
            <>
              <Route path="/chat" element={<AppShell />} />
              <Route path="/chat/:id" element={<AppShell />} />
              <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
              <Route path="/account" element={<AppLayout><Account /></AppLayout>} />
              <Route path="/memory" element={<AppLayout><Memory /></AppLayout>} />
              <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="promo" element={<AdminPromo />} />
              </Route>
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </>
      ) : (
        <>
          {/* Website: marketing pages only — app is desktop-only */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Navigate to="/account" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/account" replace /> : <Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/eula" element={<Eula />} />
          <Route path="/share/:token" element={<SharedChat />} />
          <Route path="/marketplace" element={<MCPMarketplace />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<GettingStarted />} />
            <Route path="getting-started" element={<GettingStarted />} />
            <Route path="features" element={<Features />} />
            <Route path="desktop-app" element={<DesktopApp />} />
            <Route path="api" element={<ApiReference />} />
            <Route path="usage-guide" element={<UsageGuide />} />
            <Route path="faq" element={<Faq />} />
          </Route>
          {/* Logged-in web users: account management only — brain is desktop */}
          {user && (
            <>
              <Route path="/chat" element={<Navigate to="/account" replace />} />
              <Route path="/chat/:id" element={<Navigate to="/account" replace />} />
              <Route path="/settings" element={<Navigate to="/account" replace />} />
              <Route path="/account" element={<Account />} />
              <Route path="/brain" element={<Navigate to="/account" replace />} />
              <Route path="/memory" element={<Navigate to="/account" replace />} />
              <Route path="/dashboard" element={<Navigate to="/account" replace />} />
            </>
          )}
          {/* Anonymous web users: show desktop-only page */}
          {!user && (
            <>
              <Route path="/chat" element={<DesktopOnly />} />
              <Route path="/chat/:id" element={<DesktopOnly />} />
              <Route path="/settings" element={<DesktopOnly />} />
              <Route path="/account" element={<DesktopOnly />} />
              <Route path="/memory" element={<DesktopOnly />} />
              <Route path="/dashboard" element={<DesktopOnly />} />
            </>
          )}
          {/* Admin stays accessible for admins on web */}
          {user?.isAdmin && (
            <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="promo" element={<AdminPromo />} />
            </Route>
          )}
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  )
}