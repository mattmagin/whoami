import { type Dispatch, type SetStateAction } from 'react'
import { type NavigateFunction } from 'react-router-dom'
import { NAV_SHORTCUTS } from '@/consts'
import useKeyBindings, { type KeyBinding } from '@/hooks/useKeyBindings'

/**
 * Registers global keyboard listeners for the command palette:
 * - Ctrl+K / ⌘K to toggle open/close
 * - Single-key nav shortcuts (0–4) when the palette is closed
 */
const useCommandPaletteKeys = (
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    navigate: NavigateFunction,
) => {
    const toggle = () => setOpen((prev) => !prev)

    const bindings: KeyBinding[] = [
        // ⌘K or Ctrl+K — toggle the palette (works even inside inputs)
        {
            keys: ['Control', 'k'],
            callback: toggle,
            preventDefault: true,
            allowInInputs: true,
        },
        {
            keys: ['Meta', 'k'],
            callback: toggle,
            preventDefault: true,
            allowInInputs: true,
        },
    ]

    // Single-key navigation shortcuts (only when palette is closed)
    if (!open) {
        for (const [key, path] of Object.entries(NAV_SHORTCUTS)) {
            bindings.push({
                keys: [key],
                callback: () => navigate(path),
                preventDefault: true,
            })
        }
    }

    useKeyBindings(bindings)
}

export default useCommandPaletteKeys
