// Theme configuration with all colors in hex format
// Fonts and radii are also defined here

import { THEME_PREFERENCE, COLOR_THEME, type ThemeMode, type ColorTheme } from '@/consts'

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
    sans: '"DM Sans Variable", "DM Sans", system-ui, sans-serif',
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

// ---------------------------------------------------------------------------
// Color Palette System
// ---------------------------------------------------------------------------

export interface ColorPalette {
    light: Partial<ThemeColors>
    dark: Partial<ThemeColors>
}

export const colorPalettes: Record<ColorTheme, ColorPalette> = {
    [COLOR_THEME.FOREST]: {
        light: {},
        dark: {},
    },

    [COLOR_THEME.CRIMSON]: {
        light: {
            primaryLight: '#a83865',
            primaryMuted: '#c48a95',
            background: '#fafaf9',
            foreground: '#2e1a1f',
            card: '#fcfbfb',
            cardForeground: '#2e1a1f',
            popover: '#fcfbfb',
            popoverForeground: '#2e1a1f',
            primary: '#8b2252',
            primaryForeground: '#fdf5f7',
            secondary: '#f2eced',
            secondaryForeground: '#4a2233',
            muted: '#f2efef',
            mutedForeground: '#7a5c62',
            accent: '#ebe0e2',
            accentForeground: '#4a2233',
            border: '#e5dbdd',
            input: '#e8e0e2',
            ring: '#a83865',
            chart1: '#8b2252',
            chart2: '#a83865',
            chart3: '#c48a95',
            chart4: '#8a4a6a',
            chart5: '#c4708a',
            selection: 'rgba(139, 34, 82, 0.3)',
            gridLine: 'rgba(139, 34, 82, 0.12)',
            gridGlow: '#8b2252',
        },
        dark: {
            primaryLight: '#e88a9e',
            primaryMuted: '#c4a0a8',
            background: '#1f1417',
            foreground: '#ebe5e6',
            card: '#2b1a1e',
            cardForeground: '#ebe5e6',
            popover: '#2b1a1e',
            popoverForeground: '#ebe5e6',
            primary: '#e06680',
            primaryForeground: '#1f1417',
            secondary: '#352529',
            secondaryForeground: '#e5dce0',
            muted: '#2d1f22',
            mutedForeground: '#ab8a90',
            accent: '#3d2a2e',
            accentForeground: '#dbc5c8',
            border: '#402d30',
            input: '#352529',
            ring: '#e06680',
            chart1: '#e06680',
            chart2: '#e88a9e',
            chart3: '#c4a0a8',
            chart4: '#e0668a',
            chart5: '#ab6a80',
            selection: 'rgba(224, 102, 128, 0.4)',
            gridLine: 'rgba(224, 102, 128, 0.08)',
            gridGlow: '#e06680',
        },
    },

    [COLOR_THEME.OCEAN]: {
        light: {
            primaryLight: '#4a6ea0',
            primaryMuted: '#8aa0c0',
            background: '#f9fafb',
            foreground: '#1a1f2e',
            card: '#fbfbfc',
            cardForeground: '#1a1f2e',
            popover: '#fbfbfc',
            popoverForeground: '#1a1f2e',
            primary: '#2d4a7a',
            primaryForeground: '#f5f7fa',
            secondary: '#edf0f5',
            secondaryForeground: '#2a3350',
            muted: '#eff1f5',
            mutedForeground: '#5c6a8a',
            accent: '#e0e5f0',
            accentForeground: '#2a3350',
            border: '#dbe0ea',
            input: '#e0e4ed',
            ring: '#5c7aab',
            chart1: '#2d4a7a',
            chart2: '#4a6ea0',
            chart3: '#8aa0c0',
            chart4: '#4a7aaa',
            chart5: '#6a8ab0',
            selection: 'rgba(92, 122, 171, 0.3)',
            gridLine: 'rgba(45, 74, 122, 0.12)',
            gridGlow: '#2d4a7a',
        },
        dark: {
            primaryLight: '#8ab4e8',
            primaryMuted: '#a0b8d0',
            background: '#14171f',
            foreground: '#e5e8ee',
            card: '#1a1e2b',
            cardForeground: '#e5e8ee',
            popover: '#1a1e2b',
            popoverForeground: '#e5e8ee',
            primary: '#6a9be0',
            primaryForeground: '#14171f',
            secondary: '#252935',
            secondaryForeground: '#dce0e8',
            muted: '#1f2330',
            mutedForeground: '#8a99b5',
            accent: '#2a3040',
            accentForeground: '#c5d0e0',
            border: '#2d3545',
            input: '#252935',
            ring: '#6a9be0',
            chart1: '#6a9be0',
            chart2: '#8ab4e8',
            chart3: '#a0b8d0',
            chart4: '#6aabe0',
            chart5: '#8a9ec0',
            selection: 'rgba(106, 155, 224, 0.4)',
            gridLine: 'rgba(106, 155, 224, 0.08)',
            gridGlow: '#6a9be0',
        },
    },

    [COLOR_THEME.AMBER]: {
        light: {
            primaryLight: '#a0823d',
            primaryMuted: '#bfa870',
            background: '#fafaf8',
            foreground: '#2e2a1a',
            card: '#fcfcfa',
            cardForeground: '#2e2a1a',
            popover: '#fcfcfa',
            popoverForeground: '#2e2a1a',
            primary: '#8a6b2d',
            primaryForeground: '#faf8f2',
            secondary: '#f5f0e5',
            secondaryForeground: '#4a3d20',
            muted: '#f4f1ea',
            mutedForeground: '#8a7a55',
            accent: '#efe8d8',
            accentForeground: '#4a3d20',
            border: '#e8e0cc',
            input: '#ede5d5',
            ring: '#a08040',
            chart1: '#8a6b2d',
            chart2: '#a0823d',
            chart3: '#bfa870',
            chart4: '#aa8a4a',
            chart5: '#c0a060',
            selection: 'rgba(160, 128, 64, 0.3)',
            gridLine: 'rgba(138, 107, 45, 0.12)',
            gridGlow: '#8a6b2d',
        },
        dark: {
            primaryLight: '#e8ca80',
            primaryMuted: '#c8b888',
            background: '#1f1c14',
            foreground: '#ebe8e0',
            card: '#2b2820',
            cardForeground: '#ebe8e0',
            popover: '#2b2820',
            popoverForeground: '#ebe8e0',
            primary: '#e0b860',
            primaryForeground: '#1f1c14',
            secondary: '#352f20',
            secondaryForeground: '#e8e2d0',
            muted: '#2d2820',
            mutedForeground: '#b5a880',
            accent: '#3d3525',
            accentForeground: '#dbd0b0',
            border: '#403822',
            input: '#352f20',
            ring: '#e0b860',
            chart1: '#e0b860',
            chart2: '#e8ca80',
            chart3: '#c8b888',
            chart4: '#e0c06a',
            chart5: '#c0a860',
            selection: 'rgba(224, 184, 96, 0.4)',
            gridLine: 'rgba(224, 184, 96, 0.08)',
            gridGlow: '#e0b860',
        },
    },

    [COLOR_THEME.VIOLET]: {
        light: {
            primaryLight: '#7a4aa0',
            primaryMuted: '#a08ac0',
            background: '#faf9fb',
            foreground: '#1f1a2e',
            card: '#fcfbfc',
            cardForeground: '#1f1a2e',
            popover: '#fcfbfc',
            popoverForeground: '#1f1a2e',
            primary: '#5a2d7a',
            primaryForeground: '#f8f5fa',
            secondary: '#f0edf5',
            secondaryForeground: '#3a2050',
            muted: '#f1eff5',
            mutedForeground: '#7a5c90',
            accent: '#e8e0f0',
            accentForeground: '#3a2050',
            border: '#e2dbea',
            input: '#e5e0ed',
            ring: '#7a5cab',
            chart1: '#5a2d7a',
            chart2: '#7a4aa0',
            chart3: '#a08ac0',
            chart4: '#7a5aaa',
            chart5: '#9a6ab0',
            selection: 'rgba(122, 92, 171, 0.3)',
            gridLine: 'rgba(90, 45, 122, 0.12)',
            gridGlow: '#5a2d7a',
        },
        dark: {
            primaryLight: '#c08ae8',
            primaryMuted: '#b8a0d0',
            background: '#171420',
            foreground: '#e8e5ee',
            card: '#1e1a2b',
            cardForeground: '#e8e5ee',
            popover: '#1e1a2b',
            popoverForeground: '#e8e5ee',
            primary: '#ab6ae0',
            primaryForeground: '#171420',
            secondary: '#2d2538',
            secondaryForeground: '#e0dce8',
            muted: '#252030',
            mutedForeground: '#9a8ab5',
            accent: '#352a42',
            accentForeground: '#d0c5e0',
            border: '#383050',
            input: '#2d2538',
            ring: '#ab6ae0',
            chart1: '#ab6ae0',
            chart2: '#c08ae8',
            chart3: '#b8a0d0',
            chart4: '#aa6adb',
            chart5: '#9a80c0',
            selection: 'rgba(171, 106, 224, 0.4)',
            gridLine: 'rgba(171, 106, 224, 0.08)',
            gridGlow: '#ab6ae0',
        },
    },

    [COLOR_THEME.SLATE]: {
        light: {
            primaryLight: '#647080',
            primaryMuted: '#94a0aa',
            background: '#fafafa',
            foreground: '#1a1f2a',
            card: '#fcfcfc',
            cardForeground: '#1a1f2a',
            popover: '#fcfcfc',
            popoverForeground: '#1a1f2a',
            primary: '#4a5568',
            primaryForeground: '#f8f9fa',
            secondary: '#f0f1f3',
            secondaryForeground: '#2d3748',
            muted: '#f1f2f4',
            mutedForeground: '#6b7888',
            accent: '#e4e7ea',
            accentForeground: '#2d3748',
            border: '#dde1e5',
            input: '#e2e5e8',
            ring: '#7888a0',
            chart1: '#4a5568',
            chart2: '#647080',
            chart3: '#94a0aa',
            chart4: '#5a7088',
            chart5: '#8090a0',
            selection: 'rgba(120, 136, 160, 0.3)',
            gridLine: 'rgba(74, 85, 104, 0.12)',
            gridGlow: '#4a5568',
        },
        dark: {
            primaryLight: '#b5c2d0',
            primaryMuted: '#90a0b0',
            background: '#151820',
            foreground: '#e5e8ee',
            card: '#1c2028',
            cardForeground: '#e5e8ee',
            popover: '#1c2028',
            popoverForeground: '#e5e8ee',
            primary: '#a0b0c0',
            primaryForeground: '#151820',
            secondary: '#252830',
            secondaryForeground: '#dce0e5',
            muted: '#202428',
            mutedForeground: '#8899a8',
            accent: '#2a3038',
            accentForeground: '#c5d0d8',
            border: '#303540',
            input: '#252830',
            ring: '#a0b0c0',
            chart1: '#a0b0c0',
            chart2: '#b5c2d0',
            chart3: '#90a0b0',
            chart4: '#8a9eb0',
            chart5: '#a0a8b5',
            selection: 'rgba(160, 176, 192, 0.4)',
            gridLine: 'rgba(160, 176, 192, 0.08)',
            gridGlow: '#a0b0c0',
        },
    },
}

export const getTheme = (key: ThemeKey, colorTheme: ColorTheme = COLOR_THEME.FOREST): Theme => {
    const base = themes[key]
    const palette = colorPalettes[colorTheme]
    const overrides = key === THEME_PREFERENCE.LIGHT ? palette.light : palette.dark
    return {
        ...base,
        colors: { ...base.colors, ...overrides },
    }
}

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
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
    },
} as const

export type ThemeVars = typeof themeVars
