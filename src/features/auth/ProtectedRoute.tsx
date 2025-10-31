import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LoadingPage } from '@/components/ui/LoadingSpinner'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requireRole?: 'member' | 'librarian'
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingPage />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role if required
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}
