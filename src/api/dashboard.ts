import apiClient from './client'
import type { DashboardResponse } from '@/types'

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get('/dashboard')
    return response.data
  },
}
