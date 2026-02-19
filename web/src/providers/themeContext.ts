import { createContext, useContext } from 'react'
import type { Theme, ThemeKey, ThemeColors, ThemeFonts, ThemeRadii, ColorPalette } from '@/theme'
import type { ThemePreference, ColorTheme } from '@/consts'

export interface ThemeContextType {
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

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

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
export type { Theme, ThemeKey, ThemeColors, ThemeFonts, ThemeRadii, ColorPalette }
export { themes, getTheme, lightTheme, darkTheme } from '@/theme'
