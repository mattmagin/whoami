import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ThemeProvider as EmotionThemeProvider, Global, css } from '@emotion/react'
import { getTheme, type Theme, type ThemeKey } from '@/theme'

interface ThemeContextType {
  themeKey: ThemeKey
  theme: Theme
  setTheme: (key: ThemeKey) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const getSystemTheme = (): ThemeKey => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getInitialTheme = (): ThemeKey => {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem('theme') as ThemeKey | null
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  // First visit: use system preference and store it
  const systemTheme = getSystemTheme()
  localStorage.setItem('theme', systemTheme)
  return systemTheme
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

      /* Forest palette */
      --forest: ${theme.colors.forest};
      --forest-light: ${theme.colors.forestLight};
      --sage: ${theme.colors.sage};

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
  const [themeKey, setThemeKey] = useState<ThemeKey>(getInitialTheme)
  const theme = getTheme(themeKey)

  useEffect(() => {
    const root = document.documentElement

    if (themeKey === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [themeKey])

  function setTheme(newKey: ThemeKey) {
    localStorage.setItem('theme', newKey)
    setThemeKey(newKey)
  }

  function toggleTheme() {
    setTheme(themeKey === 'light' ? 'dark' : 'light')
  }

  const contextValue: ThemeContextType = {
    themeKey,
    theme,
    setTheme,
    toggleTheme,
  }

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
export type { Theme, ThemeKey, ThemeColors, ThemeFonts, ThemeRadii } from '@/theme'
export { themes, getTheme, lightTheme, darkTheme } from '@/theme'
