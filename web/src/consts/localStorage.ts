import type { ThemePreference } from './theme'

export const STORAGE_KEYS = {
    THEME: 'theme',
    QUERY_CACHE: 'whoami-query-cache',
    CONTENT_VERSION: 'whoami-content-version',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

export interface StorageSchema {
    [STORAGE_KEYS.THEME]: ThemePreference
    [STORAGE_KEYS.QUERY_CACHE]: string
    [STORAGE_KEYS.CONTENT_VERSION]: string
}
