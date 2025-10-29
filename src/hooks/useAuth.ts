import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import type { SignUpData, SignInData } from '@/types'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
}

// Get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Sign up mutation
export function useSignUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SignUpData) => authApi.signUp(data),
    onSuccess: () => {
      // Invalidate current user query
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
    },
  })
}

// Sign in mutation
export function useSignIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SignInData) => authApi.signIn(data),
    onSuccess: () => {
      // Invalidate current user query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
    },
  })
}

// Sign out mutation
export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.signOut(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear()
    },
  })
}
