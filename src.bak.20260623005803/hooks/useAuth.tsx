import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

const API_BASE = '/api'

interface User {
  id: string
  email: string
  displayName: string
  tier: string
  features: Record<string, any>
  avatarUrl?: string
  trialEndsAt?: string
  emailVerified?: boolean
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<string | null>
  accessToken: string | null
  resendVerification: (email: string) => Promise<string>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('lodestone_access_token')
    const refresh = localStorage.getItem('lodestone_refresh_token')
    if (token) {
      setAccessToken(token)
      fetchUser(token)
    } else if (refresh) {
      doRefresh(refresh).then(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchUser(token: string) {
    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        // Token expired, try refresh
        const refresh = localStorage.getItem('lodestone_refresh_token')
        if (refresh) {
          await doRefresh(refresh)
        } else {
          clearTokens()
        }
      }
    } catch {
      clearTokens()
    }
    setLoading(false)
  }

  async function doRefresh(refresh: string): Promise<string | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      })
      if (res.ok) {
        const data = await res.json()
        setTokens(data.accessToken, data.refreshToken)
        setUser(data.user)
        return data.accessToken
      } else {
        clearTokens()
        return null
      }
    } catch {
      clearTokens()
      return null
    }
  }

  function setTokens(access: string, refresh: string) {
    localStorage.setItem('lodestone_access_token', access)
    localStorage.setItem('lodestone_refresh_token', refresh)
    setAccessToken(access)
  }

  function clearTokens() {
    localStorage.removeItem('lodestone_access_token')
    localStorage.removeItem('lodestone_refresh_token')
    setAccessToken(null)
    setUser(null)
  }

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Login failed')
    }
    const data = await res.json()
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)
  }, [])

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Registration failed')
    }
    const data = await res.json()
    setTokens(data.accessToken, data.refreshToken)
    setUser(data.user)
  }, [])

  const resendVerification = useCallback(async (email: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    return data.message || 'Check your email'
  }, [])

  const logout = useCallback(async () => {
    const token = localStorage.getItem('lodestone_access_token')
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {}
    }
    clearTokens()
  }, [])

  const refreshTokenFn = useCallback(async (): Promise<string | null> => {
    const refresh = localStorage.getItem('lodestone_refresh_token')
    if (!refresh) return null
    return doRefresh(refresh)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshToken: refreshTokenFn, accessToken, resendVerification }}>
      {children}
    </AuthContext.Provider>
  )
}
