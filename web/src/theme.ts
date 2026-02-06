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
}

export interface ThemeRadii {
    base: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
}

export interface Theme {
    key: ThemeKey
    colors: ThemeColors
    fonts: ThemeFonts
    radii: ThemeRadii
}

const fonts: ThemeFonts = {
    sans: '"DM Sans", system-ui, sans-serif',
    serif: '"Fraunces", Georgia, serif',
    mono: '"JetBrains Mono", monospace',
}

const baseRadius = '0.5rem'

const radii: ThemeRadii = {
    base: baseRadius,
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
}

export const themes: Record<ThemeKey, Theme> = {
    light: lightTheme,
    dark: darkTheme,
}

export function getTheme(key: ThemeKey): Theme {
    return themes[key]
}
