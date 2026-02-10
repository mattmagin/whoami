import type { ThemeMode, ColorTheme } from './theme'

export const STORAGE_KEYS = {
    THEME: 'theme',
    COLOR_THEME: 'color-theme',
    QUERY_CACHE: 'whoami-query-cache',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

export interface StorageSchema {
    [STORAGE_KEYS.THEME]: ThemeMode
    [STORAGE_KEYS.COLOR_THEME]: ColorTheme
    [STORAGE_KEYS.QUERY_CACHE]: string
}
