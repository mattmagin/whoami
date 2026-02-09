// Theme configuration with all colors in hex format
// Fonts and radii are also defined here

export type ThemeKey = 'light' | 'dark'

export interface ThemeColors {
    // Forest palette
    forest: string
    forestLight: string
    sage: string

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
}

export interface ThemeFonts {
    sans: string
    serif: string
    mono: string
    outfit: string
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
    sans: '"DM Sans", system-ui, sans-serif',
    serif: '"Fraunces", Georgia, serif',
    mono: '"JetBrains Mono", monospace',
    outfit: '"Outfit", system-ui, sans-serif',
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
    key: 'light',
    colors: {
        // Forest Green palette
        forest: '#2d5a3d',
        forestLight: '#4a7c59',
        sage: '#8fa88a',

        // Base colors
        background: '#fafaf9',
        foreground: '#1a2e1f',

        // Card
        card: '#fcfcfb',
        cardForeground: '#1a2e1f',

        // Popover
        popover: '#fcfcfb',
        popoverForeground: '#1a2e1f',

        // Primary - Forest Green
        primary: '#2d5a3d',
        primaryForeground: '#f5faf6',

        // Secondary
        secondary: '#eef2ed',
        secondaryForeground: '#2a4a33',

        // Muted
        muted: '#f0f2ef',
        mutedForeground: '#5c7a62',

        // Accent - Sage
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

// Dark Mode - Deep forest at night
export const darkTheme: Theme = {
    key: 'dark',
    colors: {
        // Forest Green palette (adjusted for dark)
        forest: '#6aab7a',
        forestLight: '#8ac49a',
        sage: '#a8c4a0',

        // Base colors
        background: '#141f17',
        foreground: '#e5ebe6',

        // Card
        card: '#1a2b1e',
        cardForeground: '#e5ebe6',

        // Popover
        popover: '#1a2b1e',
        popoverForeground: '#e5ebe6',

        // Primary - Forest Green (lighter for visibility)
        primary: '#6aab7a',
        primaryForeground: '#141f17',

        // Secondary
        secondary: '#253529',
        secondaryForeground: '#dce5dd',

        // Muted
        muted: '#1f2d22',
        mutedForeground: '#8aab8e',

        // Accent - Sage
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
    light: lightTheme,
    dark: darkTheme,
}

export const getTheme = (key: ThemeKey): Theme => {
    return themes[key]
}

/**
 * CSS variable references for use with Emotion styled components
 * These reference the CSS custom properties set by ThemeContext
 */
export const themeVars = {
    colors: {
        // Forest palette
        forest: 'var(--forest)',
        forestLight: 'var(--forest-light)',
        sage: 'var(--sage)',

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
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
    },
} as const

export type ThemeVars = typeof themeVars
