import { useCallback } from 'react'
import { useAuth } from './useAuth'

export function useAdmin() {
  const { user, accessToken, refreshToken } = useAuth()

  const isAdmin = user?.isAdmin === true

  const adminFetch = useCallback(async function adminFetch<T>(path: string, opts?: RequestInit): Promise<T> {
    const token = accessToken || localStorage.getItem('lodestone_access_token')
    const res = await fetch(`/api/admin${path}`, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...opts?.headers,
      },
    })
    
    // Only retry once on 401 (expired token)
    if (res.status === 401) {
      const newToken = await refreshToken()
      if (newToken) {
        const retry = await fetch(`/api/admin${path}`, {
          ...opts,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
            ...opts?.headers,
          },
        })
        if (!retry.ok) {
          if (retry.status === 429) throw new Error('Too many requests. Please wait a moment and try again.')
          throw new Error(`Admin API error: ${retry.status}`)
        }
        return retry.json()
      }
      throw new Error('Unauthorized')
    }
    
    // Don't retry on 429 or other errors
    if (res.status === 429) throw new Error('Too many requests. Please wait a moment and try again.')
    if (!res.ok) throw new Error(`Admin API error: ${res.status}`)
    return res.json()
  }, [accessToken, refreshToken])

  return { isAdmin, adminFetch }
}
