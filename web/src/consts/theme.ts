import { Sun, Moon, Monitor, type LucideIcon } from 'lucide-react'

export const THEME_PREFERENCE = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
} as const

export type ThemePreference = typeof THEME_PREFERENCE[keyof typeof THEME_PREFERENCE]

export type ThemeMode = Exclude<ThemePreference, typeof THEME_PREFERENCE.SYSTEM>

export const DEFAULT_THEME: ThemePreference = THEME_PREFERENCE.SYSTEM

export interface ThemeOptionDefinition {
    value: ThemePreference
    icon: LucideIcon
    label: string
}

export const THEME_OPTIONS: ThemeOptionDefinition[] = [
    { value: THEME_PREFERENCE.LIGHT, icon: Sun, label: 'Light' },
    { value: THEME_PREFERENCE.SYSTEM, icon: Monitor, label: 'System' },
    { value: THEME_PREFERENCE.DARK, icon: Moon, label: 'Dark' },
]
