import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { minutesToMilliseconds } from './utils'

const LOCAL_STORAGE_CACHE_KEY = 'whoami-query-cache'
const STALE_TIME = minutesToMilliseconds(5)
const INACTIVE_TIME = minutesToMilliseconds(30)
const RETRYS = 3
const RETRY_DELAY = (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: INACTIVE_TIME,
      refetchOnWindowFocus: false,
      retry: RETRYS,
      retryDelay: RETRY_DELAY,
    },
  },
})


export const persister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
  },
  key: LOCAL_STORAGE_CACHE_KEY,
})

export const persistOptions = {
  persister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query: { state: { status: string } }) => {
      return query.state.status === 'success'
    },
  },
}
