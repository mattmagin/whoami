import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { minutesToMilliseconds } from './utils'
import { STORAGE_KEYS } from '@/consts'
import { getContentVersion } from '@/api'

const STALE_TIME = minutesToMilliseconds(5)
const GC_TIME = minutesToMilliseconds(60 * 24 * 30) // 30 days
const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24 * 30 // 30 days
const RETRIES = 3
const RETRY_DELAY = (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      refetchOnWindowFocus: false,
      retry: RETRIES,
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
  key: STORAGE_KEYS.QUERY_CACHE,
})

export const persistOptions = {
  persister,
  maxAge: PERSIST_MAX_AGE,
  buster: __BUILD_TIMESTAMP__,
  dehydrateOptions: {
    shouldDehydrateQuery: (query: { state: { status: string } }) => {
      return query.state.status === 'success'
    },
  },
}

/**
 * Check the API's content version against what we last saw.
 * If the version changed (content was created/updated/deleted),
 * invalidate all queries so fresh data is fetched.
 * Silently no-ops if the API is unreachable.
 */
// TODO: manually test the checkContentVersion and ensure after X time the content is no refetched if not changed.
export const checkContentVersion = async () => {
  try {
    const version = await getContentVersion()
    const stored = window.localStorage.getItem(STORAGE_KEYS.CONTENT_VERSION)

    if (stored && stored !== version) {
      await queryClient.invalidateQueries()
    }

    window.localStorage.setItem(STORAGE_KEYS.CONTENT_VERSION, version)
  } catch {
    // API unreachable — serve from cache silently
  }
}
