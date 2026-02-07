import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

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

export const persister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
  },
  key: 'whoami-query-cache', // Cache key in localStorage
})
