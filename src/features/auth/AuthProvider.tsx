import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useCurrentUser } from '@/hooks/useAuth'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, token, logout } = useAuthStore()
  const { data, isLoading, isError } = useCurrentUser()

  useEffect(() => {
    if (isLoading) {
      setLoading(true)
      return
    }

    if (isError || !data) {
      // Token is invalid or expired
      if (token) {
        logout()
      }
      setLoading(false)
      return
    }

    // Update user in store
    if (data.user) {
      setUser(data.user)
    }
    setLoading(false)
  }, [data, isLoading, isError, setUser, setLoading, token, logout])

  return <>{children}</>
}
