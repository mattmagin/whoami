import type { ThemePreference, ColorTheme } from './theme'

export const STORAGE_KEYS = {
    THEME: 'theme',
    COLOR_THEME: 'color-theme',
    QUERY_CACHE: 'whoami-query-cache',
    CONTENT_VERSION: 'whoami-content-version',
    BORING_MODE: 'boring-mode',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

export interface StorageSchema {
    [STORAGE_KEYS.THEME]: ThemePreference
    [STORAGE_KEYS.COLOR_THEME]: ColorTheme
    [STORAGE_KEYS.QUERY_CACHE]: string
    [STORAGE_KEYS.CONTENT_VERSION]: string
    [STORAGE_KEYS.BORING_MODE]: string
}
