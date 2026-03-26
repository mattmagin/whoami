// Theme configuration with all colors in hex format
// Fonts and radii are also defined here

import { THEME_PREFERENCE, type ThemeMode } from '@/consts'

export type ThemeKey = ThemeMode

export interface ThemeColors {
    // Primary color variants
    primaryLight: string
    primaryMuted: string

    // Base colors
    background: string
    foreground: string

    // Card
    card: string
    cardForeground: string

    // Popover
    popover: string
    popoverForeground: string

    // Primary
    primary: string
    primaryForeground: string

    // Secondary
    secondary: string
    secondaryForeground: string

    // Muted
    muted: string
    mutedForeground: string

    // Accent
    accent: string
    accentForeground: string

    // Destructive
    destructive: string

    // Border & Input
    border: string
    input: string
    ring: string

    // Charts
    chart1: string
    chart2: string
    chart3: string
    chart4: string
    chart5: string

    // Selection
    selection: string

    // Gridlines background
    gridLine: string
    gridGlow: string
}

export interface ThemeFonts {
    sans: string
    heading: string
    serif: string
    mono: string
}

export interface ThemeRadii {
    base: string
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
}

// Logger style configuration
export interface LoggerStyleConfig {
    color: string
    fontSize: string
    fontWeight?: string
    fontFamily?: string
    fontStyle?: string
    background?: string
    padding?: string
    borderRadius?: string
}

export type LoggerStylePreset = 'heading' | 'subheading' | 'body' | 'accent' | 'muted' | 'link' | 'code' | 'success' | 'warning' | 'error'

export type ThemeLogger = Record<LoggerStylePreset, LoggerStyleConfig>

export interface Theme {
    key: ThemeKey
    colors: ThemeColors
    fonts: ThemeFonts
    radii: ThemeRadii
    logger: ThemeLogger
}

const fonts: ThemeFonts = {
    sans: '"Public Sans", system-ui, sans-serif',
    heading: '"Syne", system-ui, sans-serif',
    serif: '"Fraunces Variable", "Fraunces", Georgia, serif',
    mono: '"JetBrains Mono Variable", "JetBrains Mono", monospace',
}

const baseRadius = '0.5rem'

const radii: ThemeRadii = {
    base: baseRadius,
    xs: 'calc(0.5rem - 6px)',
    sm: 'calc(0.5rem - 4px)',
    md: 'calc(0.5rem - 2px)',
    lg: '0.5rem',
    xl: 'calc(0.5rem + 4px)',
    '2xl': 'calc(0.5rem + 8px)',
    '3xl': 'calc(0.5rem + 12px)',
    '4xl': 'calc(0.5rem + 16px)',
}

// Light Mode - Warm, natural feel
export const lightTheme: Theme = {
    key: THEME_PREFERENCE.LIGHT,
    colors: {
        // Primary color variants
        primaryLight: '#4a7c59',
        primaryMuted: '#8fa88a',

        // Base colors
        background: '#fafaf9',
        foreground: '#1a2e1f',

        // Card
        card: '#fcfcfb',
        cardForeground: '#1a2e1f',

        // Popover
        popover: '#fcfcfb',
        popoverForeground: '#1a2e1f',

        // Primary
        primary: '#2d5a3d',
        primaryForeground: '#f5faf6',

        // Secondary
        secondary: '#eef2ed',
        secondaryForeground: '#2a4a33',

        // Muted
        muted: '#f0f2ef',
        mutedForeground: '#5c7a62',

        // Accent
        accent: '#e2ebe0',
        accentForeground: '#2a4a33',

        // Destructive
        destructive: '#c94a4a',

        // Border & Input
        border: '#dde5db',
        input: '#e2e8e0',
        ring: '#5c8a66',

        // Charts
        chart1: '#3d6b4d',
        chart2: '#5c8a66',
        chart3: '#8fa88a',
        chart4: '#4a8a8a',
        chart5: '#8a8a5c',

        // Selection
        selection: 'rgba(92, 138, 102, 0.3)',

        // Gridlines background
        gridLine: 'rgba(45, 90, 61, 0.12)',
        gridGlow: '#2d5a3d',
    },
    fonts,
    radii,
    logger: {
        heading: {
            color: '#4a7c59',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: fonts.mono,
        },
        subheading: {
            color: '#2d5a3d',
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
        body: {
            color: '#5c7a62',
            fontSize: '12px',
            fontFamily: fonts.sans,
        },
        accent: {
            color: '#2d5a3d',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
        muted: {
            color: '#8fa88a',
            fontSize: '11px',
            fontStyle: 'italic',
            fontFamily: fonts.sans,
        },
        link: {
            color: '#4a7c59',
            fontSize: '12px',
            fontFamily: fonts.mono,
            background: '#eef2ed',
            padding: '2px 6px',
            borderRadius: radii.sm,
        },
        code: {
            color: '#c4501b',
            fontSize: '12px',
            fontFamily: fonts.mono,
            background: '#fff4eb',
            padding: '2px 6px',
            borderRadius: radii.xs,
        },
        success: {
            color: '#3d6b4d',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
        warning: {
            color: '#8a8a5c',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
        error: {
            color: '#c94a4a',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
    },
}

// Dark Mode
export const darkTheme: Theme = {
    key: THEME_PREFERENCE.DARK,
    colors: {
        // Primary color variants (adjusted for dark)
        primaryLight: '#8ac49a',
        primaryMuted: '#a8c4a0',

        // Base colors
        background: '#141f17',
        foreground: '#e5ebe6',

        // Card
        card: '#1a2b1e',
        cardForeground: '#e5ebe6',

        // Popover
        popover: '#1a2b1e',
        popoverForeground: '#e5ebe6',

        // Primary (lighter for dark mode visibility)
        primary: '#6aab7a',
        primaryForeground: '#141f17',

        // Secondary
        secondary: '#253529',
        secondaryForeground: '#dce5dd',

        // Muted
        muted: '#1f2d22',
        mutedForeground: '#8aab8e',

        // Accent
        accent: '#2a3d2e',
        accentForeground: '#c5dbc8',

        // Destructive
        destructive: '#e06666',

        // Border & Input
        border: '#2d402f',
        input: '#253529',
        ring: '#6aab7a',

        // Charts
        chart1: '#6aab7a',
        chart2: '#8ac49a',
        chart3: '#a8c4a0',
        chart4: '#6aabab',
        chart5: '#abab6a',

        // Selection
        selection: 'rgba(106, 171, 122, 0.4)',

        // Gridlines background
        gridLine: 'rgba(106, 171, 122, 0.08)',
        gridGlow: '#6aab7a',
    },
    fonts,
    radii,
    // TODO: review logger theme colors for dark and light themes....
    logger: {
        heading: {
            color: '#8ac49a',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: fonts.mono,
        },
        subheading: {
            color: '#6aab7a',
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
        body: {
            color: '#8aab8e',
            fontSize: '12px',
            fontFamily: fonts.sans,
        },
        accent: {
            color: '#6aab7a',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
        muted: {
            color: '#a8c4a0',
            fontSize: '11px',
            fontStyle: 'italic',
            fontFamily: fonts.sans,
        },
        link: {
            color: '#8ac49a',
            fontSize: '12px',
            fontFamily: fonts.mono,
            background: '#253529',
            padding: '2px 6px',
            borderRadius: radii.sm,
        },
        code: {
            color: '#c4501b',
            fontSize: '12px',
            fontFamily: fonts.mono,
            background: '#dee2e6',
            padding: '2px 6px',
            borderRadius: radii.xs,
        },
        success: {
            color: '#6aab7a',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
        warning: {
            color: '#abab6a',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
        error: {
            color: '#e06666',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: fonts.sans,
        },
    },
}

export const themes: Record<ThemeKey, Theme> = {
    [THEME_PREFERENCE.LIGHT]: lightTheme,
    [THEME_PREFERENCE.DARK]: darkTheme,
}

export const getTheme = (key: ThemeKey): Theme => themes[key]

/**
 * CSS variable references for use with Emotion styled components
 * These reference the CSS custom properties set by ThemeContext
 */
export const themeVars = {
    colors: {
        // Primary color variants
        primaryLight: 'var(--primary-light)',
        primaryMuted: 'var(--primary-muted)',

        // Base colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        // Card
        card: 'var(--card)',
        cardForeground: 'var(--card-foreground)',

        // Popover
        popover: 'var(--popover)',
        popoverForeground: 'var(--popover-foreground)',

        // Primary
        primary: 'var(--primary)',
        primaryForeground: 'var(--primary-foreground)',

        // Secondary
        secondary: 'var(--secondary)',
        secondaryForeground: 'var(--secondary-foreground)',

        // Muted
        muted: 'var(--muted)',
        mutedForeground: 'var(--muted-foreground)',

        // Accent
        accent: 'var(--accent)',
        accentForeground: 'var(--accent-foreground)',

        // Destructive
        destructive: 'var(--destructive)',

        // Border & Input
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        // Gridlines background
        gridLine: 'var(--grid-line)',
        gridGlow: 'var(--grid-glow)',
    },

    radii: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        '4xl': 'var(--radius-4xl)',
    },

    fonts: {
        sans: 'var(--font-sans)',
        heading: 'var(--font-heading)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
    },
} as const

export type ThemeVars = typeof themeVars
