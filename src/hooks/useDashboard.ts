import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  data: () => [...dashboardKeys.all, 'data'] as const,
}

// Fetch dashboard data (role-specific)
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: () => dashboardApi.getDashboard(),
    // Refetch every 30 seconds for real-time updates
    refetchInterval: 30000,
  })
}
