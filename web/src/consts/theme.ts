import { Sun, Moon, Monitor, type LucideIcon } from 'lucide-react'

export const THEME_MODE = {
    LIGHT: 'light',
    DARK: 'dark',
} as const

export type ThemeMode = typeof THEME_MODE[keyof typeof THEME_MODE]

/** User preference — includes 'system' which resolves to light/dark at runtime */
export const THEME_PREFERENCE = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
} as const

export type ThemePreference = typeof THEME_PREFERENCE[keyof typeof THEME_PREFERENCE]

export const DEFAULT_THEME: ThemePreference = THEME_PREFERENCE.SYSTEM

export interface ThemeOptionDefinition {
    value: ThemePreference
    icon: LucideIcon
    label: string
}

/** Theme preference picker options (Light / System / Dark) */
export const THEME_OPTIONS: ThemeOptionDefinition[] = [
    { value: THEME_PREFERENCE.LIGHT, icon: Sun, label: 'Light' },
    { value: THEME_PREFERENCE.SYSTEM, icon: Monitor, label: 'System' },
    { value: THEME_PREFERENCE.DARK, icon: Moon, label: 'Dark' },
]

export const COLOR_THEME = {
    FOREST: 'forest',
    CRIMSON: 'crimson',
    OCEAN: 'ocean',
    AMBER: 'amber',
    VIOLET: 'violet',
    SLATE: 'slate',
} as const

export type ColorTheme = typeof COLOR_THEME[keyof typeof COLOR_THEME]

export const DEFAULT_COLOR_THEME: ColorTheme = COLOR_THEME.FOREST

/** Search aliases so users can find color themes by common color name */
export const COLOR_THEME_ALIASES: Record<ColorTheme, string> = {
    [COLOR_THEME.FOREST]: 'green',
    [COLOR_THEME.CRIMSON]: 'red',
    [COLOR_THEME.OCEAN]: 'blue',
    [COLOR_THEME.AMBER]: 'yellow gold orange',
    [COLOR_THEME.VIOLET]: 'purple',
    [COLOR_THEME.SLATE]: 'grey gray',
}
