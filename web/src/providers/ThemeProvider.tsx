import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react'
import { ThemeProvider as EmotionThemeProvider, Global, css } from '@emotion/react'
import { getTheme, type Theme, type ThemeKey } from '@/theme'
import {
  THEME_PREFERENCE,
  DEFAULT_THEME,
  DEFAULT_COLOR_THEME,
  STORAGE_KEYS,
  COLOR_THEME,
  type ThemePreference,
  type ColorTheme,
} from '@/consts'
import { getStorageItem, setStorageItem } from '@/lib/localStorage'

interface ThemeContextType {
  /** The user's stored preference – may be 'system' */
  preference: ThemePreference
  /** The resolved theme key – always 'light' or 'dark' */
  themeKey: ThemeKey
  colorTheme: ColorTheme
  theme: Theme
  /** Set the user's preference (light / dark / system) */
  setTheme: (pref: ThemePreference) => void
  setColorTheme: (key: ColorTheme) => void
  toggleTheme: () => void
  /** Cycle through light → dark → system → light */
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themePreferences = Object.values(THEME_PREFERENCE) as ThemePreference[]
const colorThemes = Object.values(COLOR_THEME) as ColorTheme[]

/** Detect OS preference */
const getSystemTheme = (): ThemeKey => {
  if (typeof window === 'undefined') return THEME_PREFERENCE.DARK
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME_PREFERENCE.DARK
    : THEME_PREFERENCE.LIGHT
}

/** Resolve a preference to an actual ThemeKey */
const resolveTheme = (pref: ThemePreference): ThemeKey => {
  if (pref === THEME_PREFERENCE.SYSTEM) return getSystemTheme()
  return pref as ThemeKey
}

const getInitialPreference = (): ThemePreference => {
  if (typeof window === 'undefined') return DEFAULT_THEME

  const stored = getStorageItem(STORAGE_KEYS.THEME)
  if (stored && themePreferences.includes(stored as ThemePreference)) {
    return stored as ThemePreference
  }

  setStorageItem(STORAGE_KEYS.THEME, DEFAULT_THEME)
  return DEFAULT_THEME
}

const getInitialColorTheme = (): ColorTheme => {
  if (typeof window === 'undefined') return DEFAULT_COLOR_THEME

  const stored = getStorageItem(STORAGE_KEYS.COLOR_THEME)
  if (stored && colorThemes.includes(stored as ColorTheme)) {
    return stored as ColorTheme
  }

  return DEFAULT_COLOR_THEME
}

// Generate CSS variables from theme object
const generateCssVariables = (theme: Theme) => {
  return css`
    :root {
      /* Radius */
      --radius: ${theme.radii.base};
      --radius-sm: ${theme.radii.sm};
      --radius-md: ${theme.radii.md};
      --radius-lg: ${theme.radii.lg};
      --radius-xl: ${theme.radii.xl};
      --radius-2xl: ${theme.radii['2xl']};
      --radius-3xl: ${theme.radii['3xl']};
      --radius-4xl: ${theme.radii['4xl']};

      /* Fonts */
      --font-sans: ${theme.fonts.sans};
      --font-serif: ${theme.fonts.serif};
      --font-mono: ${theme.fonts.mono};

      /* Primary color variants */
      --primary-light: ${theme.colors.primaryLight};
      --primary-muted: ${theme.colors.primaryMuted};

      /* Base colors */
      --background: ${theme.colors.background};
      --foreground: ${theme.colors.foreground};

      /* Card */
      --card: ${theme.colors.card};
      --card-foreground: ${theme.colors.cardForeground};

      /* Popover */
      --popover: ${theme.colors.popover};
      --popover-foreground: ${theme.colors.popoverForeground};

      /* Primary */
      --primary: ${theme.colors.primary};
      --primary-foreground: ${theme.colors.primaryForeground};

      /* Secondary */
      --secondary: ${theme.colors.secondary};
      --secondary-foreground: ${theme.colors.secondaryForeground};

      /* Muted */
      --muted: ${theme.colors.muted};
      --muted-foreground: ${theme.colors.mutedForeground};

      /* Accent */
      --accent: ${theme.colors.accent};
      --accent-foreground: ${theme.colors.accentForeground};

      /* Destructive */
      --destructive: ${theme.colors.destructive};

      /* Border & Input */
      --border: ${theme.colors.border};
      --input: ${theme.colors.input};
      --ring: ${theme.colors.ring};

      /* Charts */
      --chart-1: ${theme.colors.chart1};
      --chart-2: ${theme.colors.chart2};
      --chart-3: ${theme.colors.chart3};
      --chart-4: ${theme.colors.chart4};
      --chart-5: ${theme.colors.chart5};
    }

    ::selection {
      background-color: ${theme.colors.selection};
    }
  `
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreference] = useState<ThemePreference>(getInitialPreference)
  const [resolvedKey, setResolvedKey] = useState<ThemeKey>(() => resolveTheme(preference))
  const [colorThemeKey, setColorThemeKey] = useState<ColorTheme>(getInitialColorTheme)

  // Listen for OS colour-scheme changes when preference is 'system'
  useEffect(() => {
    if (preference !== THEME_PREFERENCE.SYSTEM) {
      setResolvedKey(preference as ThemeKey)
      return
    }

    // Immediately resolve once
    setResolvedKey(getSystemTheme())

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setResolvedKey(e.matches ? THEME_PREFERENCE.DARK : THEME_PREFERENCE.LIGHT)
    }

    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [preference])

  // Sync the `dark` class on <html>
  useEffect(() => {
    const root = document.documentElement
    if (resolvedKey === THEME_PREFERENCE.DARK) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedKey])

  const theme = useMemo(
    () => getTheme(resolvedKey, colorThemeKey),
    [resolvedKey, colorThemeKey],
  )

  const setTheme = useCallback((pref: ThemePreference) => {
    setStorageItem(STORAGE_KEYS.THEME, pref)
    setPreference(pref)
  }, [])

  const setColorTheme = useCallback((key: ColorTheme) => {
    setStorageItem(STORAGE_KEYS.COLOR_THEME, key)
    setColorThemeKey(key)
  }, [])

  const toggleTheme = useCallback(() => {
    // Toggle cycles resolved key (ignores system)
    const next = resolvedKey === THEME_PREFERENCE.LIGHT ? THEME_PREFERENCE.DARK : THEME_PREFERENCE.LIGHT
    setTheme(next)
  }, [resolvedKey, setTheme])

  const cycleTheme = useCallback(() => {
    // Cycle through light → dark → system → light
    const cycle: ThemePreference[] = [THEME_PREFERENCE.LIGHT, THEME_PREFERENCE.DARK, THEME_PREFERENCE.SYSTEM]
    const idx = cycle.indexOf(preference)
    const next = cycle[(idx + 1) % cycle.length]
    setTheme(next)
  }, [preference, setTheme])

  const contextValue: ThemeContextType = useMemo(() => ({
    preference,
    themeKey: resolvedKey,
    colorTheme: colorThemeKey,
    theme,
    setTheme,
    setColorTheme,
    toggleTheme,
    cycleTheme,
  }), [preference, resolvedKey, colorThemeKey, theme, setTheme, setColorTheme, cycleTheme, toggleTheme])

  return (
    <ThemeContext.Provider value={contextValue}>
      <EmotionThemeProvider theme={theme}>
        <Global styles={generateCssVariables(theme)} />
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}

// Alias for convenience - can use either useTheme or useThemeContext
export const useTheme = () => {
  return useThemeContext()
}

// Re-export theme types and utilities for convenience
export type { Theme, ThemeKey, ThemeColors, ThemeFonts, ThemeRadii, ColorPalette } from '@/theme'
export { themes, getTheme, lightTheme, darkTheme } from '@/theme'
