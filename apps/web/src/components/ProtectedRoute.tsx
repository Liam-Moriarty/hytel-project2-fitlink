import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/lib/store/useAuthStore'
import type { Role } from '@/interface'

interface ProtectedRouteProps {
  allowedRole?: Role
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { isAuthenticated, userData } = useAuthStore()

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Logged in but hasn't completed onboarding (no role yet)
  if (!userData?.role) {
    return <Navigate to="/onboarding" replace />
  }

  // Role mismatch → redirect to the user's correct dashboard
  if (allowedRole && userData.role !== allowedRole) {
    return <Navigate to={`/dashboard/${userData.role}`} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
