import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { type NavigateFunction } from 'react-router-dom'
import { NAV_SHORTCUTS } from '@/consts'

/**
 * Registers global keyboard listeners for the command palette:
 * - Ctrl+K / ⌘K to toggle open/close
 * - Single-key nav shortcuts (h, r, p, b, c) when the palette is closed
 */
const useCommandPaletteKeys = (
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    navigate: NavigateFunction,
) => {
    // Toggle the menu when ⌘K or Ctrl+K is pressed
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setOpen((prev) => !prev)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [setOpen])

    // Single-key navigation shortcuts (only when palette is closed and no input focused)
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (open) return
            if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return

            const tag = (e.target as HTMLElement)?.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return

            const path = NAV_SHORTCUTS[e.key]
            if (path) {
                e.preventDefault()
                navigate(path)
            }
        }

        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, navigate])
}

export default useCommandPaletteKeys
