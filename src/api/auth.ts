import apiClient from './client'
import type { SignUpData, SignInData, UserResponse } from '@/types'

export const authApi = {
  signUp: async (data: SignUpData): Promise<UserResponse> => {
    const response = await apiClient.post('/auth/sign_up', { user: data })
    return response.data
  },

  signIn: async (data: SignInData): Promise<UserResponse> => {
    const response = await apiClient.post('/auth/sign_in', { user: data })
    return response.data
  },

  signOut: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete('/auth/sign_out')
    return response.data
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get('/users/me')
    return response.data
  },
}
