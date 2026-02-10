import { useEffect, useMemo, useCallback, useRef, type RefObject } from 'react'
import {
    THEME_OPTIONS,
    COLOR_THEME_DEFINITIONS,
    type ColorTheme,
    type ThemePreference,
} from '@/consts'

const colorEntries = Object.entries(COLOR_THEME_DEFINITIONS) as [ColorTheme, (typeof COLOR_THEME_DEFINITIONS)[ColorTheme]][]
const colorKeys = colorEntries.map(([key]) => key)
const themePreferenceKeys = THEME_OPTIONS.map((o) => o.value)

interface UseThemePreviewOptions {
    open: boolean
    search: string
    highlightedValue: string
    preference: ThemePreference
    colorTheme: ColorTheme
    setTheme: (pref: ThemePreference) => void
    setColorTheme: (key: ColorTheme) => void
    appearanceRef: RefObject<HTMLDivElement | null>
    themeRef: RefObject<HTMLDivElement | null>
}

interface UseThemePreviewReturn {
    commitColor: () => void
    commitTheme: () => void
}

/**
 * Manages the preview-and-revert workflow for theme/color changes inside the
 * command palette:
 *
 * - Snapshots current values when the palette opens
 * - Reverts uncommitted changes when the palette closes
 * - Cycles color/theme with left/right arrow keys when their items are selected
 * - Previews color/theme when navigating search-only items
 * - Exposes `commitColor` / `commitTheme` so the caller can mark a change as intentional
 */
const useThemePreview = ({
    open,
    search,
    highlightedValue,
    preference,
    colorTheme,
    setTheme,
    setColorTheme,
    appearanceRef,
    themeRef,
}: UseThemePreviewOptions): UseThemePreviewReturn => {
    const originalColorRef = useRef<ColorTheme>(colorTheme)
    const colorCommittedRef = useRef(false)
    const originalThemeRef = useRef<ThemePreference>(preference)
    const themeCommittedRef = useRef(false)

    // Lookup maps: cmdk value → color/theme key (cmdk lowercases values)
    const colorValueMap = useMemo(() => {
        const map = new Map<string, ColorTheme>()
        for (const [key, { label, aliases }] of colorEntries) {
            map.set(`change to ${label} accent color ${aliases.join(' ')}`.toLowerCase(), key)
        }
        return map
    }, [])

    const themeValueMap = useMemo(() => {
        const map = new Map<string, ThemePreference>()
        for (const { value, label } of THEME_OPTIONS) {
            map.set(`change to ${label} mode theme`.toLowerCase(), value)
        }
        return map
    }, [])

    // Snapshot on open; revert on dismiss if not committed
    useEffect(() => {
        if (open) {
            originalColorRef.current = colorTheme
            colorCommittedRef.current = false
            originalThemeRef.current = preference
            themeCommittedRef.current = false
        } else {
            // Palette just closed — revert uncommitted changes
            if (!colorCommittedRef.current && originalColorRef.current !== colorTheme) {
                setColorTheme(originalColorRef.current)
            }
            if (!themeCommittedRef.current && originalThemeRef.current !== preference) {
                setTheme(originalThemeRef.current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // L/R arrow keys to cycle color/theme when their respective items are selected
    useEffect(() => {
        if (!open) return

        const handler = (e: KeyboardEvent) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return

            const isAppearance = appearanceRef.current?.getAttribute('aria-selected') === 'true'
            const isTheme = themeRef.current?.getAttribute('aria-selected') === 'true'

            if (!isAppearance && !isTheme) return

            e.preventDefault()
            e.stopPropagation()

            if (isAppearance) {
                const idx = colorKeys.indexOf(colorTheme)
                const next = e.key === 'ArrowRight'
                    ? colorKeys[(idx + 1) % colorKeys.length]
                    : colorKeys[(idx - 1 + colorKeys.length) % colorKeys.length]
                setColorTheme(next)
            }

            if (isTheme) {
                const idx = themePreferenceKeys.indexOf(preference)
                const next = e.key === 'ArrowRight'
                    ? themePreferenceKeys[(idx + 1) % themePreferenceKeys.length]
                    : themePreferenceKeys[(idx - 1 + themePreferenceKeys.length) % themePreferenceKeys.length]
                setTheme(next)
            }
        }

        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, colorTheme, setColorTheme, preference, setTheme, appearanceRef, themeRef])

    // Preview color/theme when navigating search-only items.
    // Only *applies* previews — reverting is handled solely by the open/close effect.
    useEffect(() => {
        if (!open || !search) return

        const matchedColor = colorValueMap.get(highlightedValue)
        if (matchedColor) {
            setColorTheme(matchedColor)
        }

        const matchedTheme = themeValueMap.get(highlightedValue)
        if (matchedTheme) {
            setTheme(matchedTheme)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [highlightedValue, search])

    const commitColor = useCallback(() => {
        colorCommittedRef.current = true
    }, [])

    const commitTheme = useCallback(() => {
        themeCommittedRef.current = true
    }, [])

    return { commitColor, commitTheme }
}

export default useThemePreview
