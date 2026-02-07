import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
      gcTime: 30 * 60 * 1000, // 30 minutes cache retention
      refetchOnWindowFocus: false, // Don't refetch on tab focus (portfolio content is stable)
      retry: 1,
    },
  },
})
