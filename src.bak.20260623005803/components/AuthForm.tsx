import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        // Check for verification params
        const params = new URLSearchParams(window.location.search)
        if (params.get('verified')) {
          window.location.href = '/chat'
        } else {
          window.location.href = '/chat'
        }
      } else {
        await register(email, password, displayName)
        setRegistered(true)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Show verification success message on login page
  if (mode === 'login') {
    const params = new URLSearchParams(window.location.search)
    const verified = params.get('verified')
    
    let verifyMessage = ''
    let verifyType = ''
    if (verified === 'true') {
      verifyMessage = '✅ Your email has been verified! You can now sign in.'
      verifyType = 'success'
    } else if (verified === 'expired') {
      verifyMessage = '⚠️ Verification link expired. Please request a new one.'
      verifyType = 'warning'
    } else if (verified === 'invalid') {
      verifyMessage = '❌ Invalid verification link. Please request a new one.'
      verifyType = 'error'
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 no-underline">
              <svg width="40" height="40" viewBox="0 0 512 512">
                <circle cx="256" cy="256" r="40" fill="#8B5CF6" opacity="0.8"/>
                <circle cx="256" cy="256" r="20" fill="#fff" opacity="0.9"/>
              </svg>
              <span className="text-2xl font-bold text-[var(--text)]">Lodestone</span>
            </Link>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8">
            <h1 className="text-xl font-bold text-center mb-6">Welcome back</h1>

            {verifyMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                verifyType === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
                verifyType === 'warning' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {verifyMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors text-sm"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : 'Sign in'}
              </button>
            </form>

            <div className="text-center mt-2"><Link to="/forgot-password" className="text-sm text-brand-400 no-underline hover:underline">Forgot your password?</Link></div>
            <p className="text-center text-sm text-[var(--text-dim)] mt-6">
              Don't have an account? <Link to="/register" className="text-brand-400 no-underline hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Register mode — show verification prompt after successful registration
  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 no-underline">
              <svg width="40" height="40" viewBox="0 0 512 512">
                <circle cx="256" cy="256" r="40" fill="#8B5CF6" opacity="0.8"/>
                <circle cx="256" cy="256" r="20" fill="#fff" opacity="0.9"/>
              </svg>
              <span className="text-2xl font-bold text-[var(--text)]">Lodestone</span>
            </Link>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-xl font-bold mb-2">Check your email</h1>
            <p className="text-[var(--text-muted)] mb-4">
              We sent a verification link to <strong className="text-[var(--text)]">{email}</strong>.
              Click the link to activate your account.
            </p>
            <p className="text-sm text-[var(--text-dim)] mb-6">
              Didn't receive it? Check your spam folder or{' '}
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/auth/resend-verification', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email }),
                    })
                    const data = await res.json()
                    setError(data.message || 'Check your email')
                  } catch {
                    setError('Failed to resend verification email')
                  }
                }}
                className="text-brand-400 hover:underline bg-transparent border-none cursor-pointer text-sm p-0"
              >
                resend the email
              </button>.
            </p>
            {error && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4">
                {error}
              </div>
            )}
            <Link to="/login" className="inline-block px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm no-underline transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 no-underline">
            <svg width="40" height="40" viewBox="0 0 512 512">
              <circle cx="256" cy="256" r="40" fill="#8B5CF6" opacity="0.8"/>
              <circle cx="256" cy="256" r="20" fill="#fff" opacity="0.9"/>
            </svg>
            <span className="text-2xl font-bold text-[var(--text)]">Lodestone</span>
          </Link>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8">
          <h1 className="text-xl font-bold text-center mb-6">Create your account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-dim)] focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors text-sm"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

            <p className="text-center text-sm text-[var(--text-dim)] mt-6">
            Already have an account? <Link to="/login" className="text-brand-400 no-underline hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--text-dim)] mt-4">
          By creating an account, you agree to our <Link to="/terms" className="text-brand-400 no-underline hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-400 no-underline hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}