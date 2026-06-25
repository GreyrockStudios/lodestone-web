import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAdmin } from '../hooks/useAdmin'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { isAdmin } = useAdmin()

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/chat" replace />

  return <>{children}</>
}