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

export interface ColorThemeDefinition {
    label: string
    preview: string
    aliases: string[]
}

export const COLOR_THEME_DEFINITIONS: Record<ColorTheme, ColorThemeDefinition> = {
    [COLOR_THEME.FOREST]: { label: 'Forest', preview: '#2d5a3d', aliases: ['green'] },
    [COLOR_THEME.CRIMSON]: { label: 'Crimson', preview: '#8b2252', aliases: ['red'] },
    [COLOR_THEME.OCEAN]: { label: 'Ocean', preview: '#2d4a7a', aliases: ['blue'] },
    [COLOR_THEME.AMBER]: { label: 'Amber', preview: '#8a6b2d', aliases: ['yellow', 'gold', 'orange'] },
    [COLOR_THEME.VIOLET]: { label: 'Violet', preview: '#5a2d7a', aliases: ['purple'] },
    [COLOR_THEME.SLATE]: { label: 'Slate', preview: '#4a5568', aliases: ['grey', 'gray'] },
}
