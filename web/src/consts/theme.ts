export const THEME_MODE = {
    LIGHT: 'light',
    DARK: 'dark',
} as const

export type ThemeMode = typeof THEME_MODE[keyof typeof THEME_MODE]

export const DEFAULT_THEME: ThemeMode = THEME_MODE.DARK

export const COLOR_THEME = {
    FOREST: 'forest',
} as const

export type ColorTheme = typeof COLOR_THEME[keyof typeof COLOR_THEME]
