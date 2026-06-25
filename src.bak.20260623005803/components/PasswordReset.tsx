import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send reset email')
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
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
          {sent ? (
            <>
              <div className="text-5xl text-center mb-4">📧</div>
              <h1 className="text-xl font-bold text-center mb-2">Check your email</h1>
              <p className="text-[var(--text-muted)] text-center mb-6">
                If <strong className="text-[var(--text)]">{email}</strong> is registered, you'll receive a password reset link. It expires in 1 hour.
              </p>
              <Link to="/login" className="block text-center w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm no-underline transition-colors">
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-center mb-2">Forgot your password?</h1>
              <p className="text-[var(--text-muted)] text-center mb-6">
                Enter your email and we'll send you a reset link.
              </p>

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
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <p className="text-center text-sm text-[var(--text-dim)] mt-6">
                Remember your password? <Link to="/login" className="text-brand-400 no-underline hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)

  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  useEffect(() => {
    if (!token || !email) {
      setValidating(false)
      setError('Invalid reset link. Please request a new one.')
      return
    }

    // Verify token is valid
    fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        setTokenValid(data.valid === true)
        setValidating(false)
      })
      .catch(() => {
        setError('Failed to verify reset link')
        setValidating(false)
      })
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
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
          {success ? (
            <>
              <div className="text-5xl text-center mb-4">✅</div>
              <h1 className="text-xl font-bold text-center mb-2">Password reset!</h1>
              <p className="text-[var(--text-muted)] text-center">
                Your password has been updated. Redirecting to sign in...
              </p>
            </>
          ) : validating ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[var(--text-muted)] mt-4">Verifying reset link...</p>
            </div>
          ) : !tokenValid ? (
            <>
              <div className="text-5xl text-center mb-4">⚠️</div>
              <h1 className="text-xl font-bold text-center mb-2">Invalid or expired link</h1>
              <p className="text-[var(--text-muted)] text-center mb-6">
                {error || 'This reset link is invalid or has expired. Please request a new one.'}
              </p>
              <Link to="/forgot-password" className="block text-center w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm no-underline transition-colors">
                Request new link
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-center mb-2">Set new password</h1>
              <p className="text-[var(--text-muted)] text-center mb-6">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">New password</label>
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
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
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
                  {loading ? 'Resetting...' : 'Reset password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}