import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const error = params.get('error')

    if (error) {
      console.error('[OAuth] Error:', error)
      window.location.href = `/login?error=${encodeURIComponent(error)}`
      return
    }

    if (accessToken) {
      localStorage.setItem('lodestone_access_token', accessToken)
      if (refreshToken) {
        localStorage.setItem('lodestone_refresh_token', refreshToken)
      }
      // Redirect to chat
      window.location.href = '/chat'
    } else {
      window.location.href = '/login?error=no_token'
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="animate-spin w-6 h-6 text-brand-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[var(--text)] mb-1">Signing you in...</h2>
        <p className="text-sm text-[var(--text-muted)]">Redirecting to Lodestone</p>
      </div>
    </div>
  )
}