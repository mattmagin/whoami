import { useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KeyBinding {
    /**
     * Keys that form the shortcut.
     *
     * Use `"Control"`, `"Shift"`, `"Alt"`, or `"Meta"` for modifier keys.
     * The remaining (non-modifier) entry is matched against `KeyboardEvent.key`
     * (case-insensitive).
     *
     * Modifiers are matched **strictly** — every listed modifier must be held
     * and every unlisted modifier must be released.
     *
     * @example ["Control", "k"]   // Ctrl+K (won't fire on Shift+Ctrl+K)
     * @example ["Escape"]          // Escape with no modifiers
     */
    keys: string[]

    /** Fired when the key combination is pressed. */
    callback: (e: KeyboardEvent) => void

    /**
     * Call `e.preventDefault()` before invoking the callback.
     * @default false
     */
    preventDefault?: boolean

    /**
     * When `true` the binding fires even when an `<input>`, `<textarea>`,
     * or `contentEditable` element is focused.
     * @default false
     */
    allowInInputs?: boolean
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MODIFIER_KEYS = new Set(['Control', 'Shift', 'Alt', 'Meta'])

/** Returns `true` when the focused element is an input-like target. */
const isInputTarget = (e: KeyboardEvent): boolean => {
    const el = e.target as HTMLElement | null
    if (!el) return false
    const tag = el.tagName
    return tag === 'INPUT' || tag === 'TEXTAREA' || !!el.isContentEditable
}

/**
 * Checks whether a `KeyboardEvent` matches a set of required keys.
 *
 * Modifier matching is **strict**: modifiers not present in `keys` must be
 * released, and modifiers present in `keys` must be held. The single
 * non-modifier key is compared case-insensitively against `e.key`.
 */
const matchesBinding = (e: KeyboardEvent, keys: string[]): boolean => {
    const requiredMods = new Set(keys.filter((k) => MODIFIER_KEYS.has(k)))
    const nonModKeys = keys.filter((k) => !MODIFIER_KEYS.has(k))

    // Strict modifier check
    if (requiredMods.has('Control') !== e.ctrlKey) return false
    if (requiredMods.has('Shift') !== e.shiftKey) return false
    if (requiredMods.has('Alt') !== e.altKey) return false
    if (requiredMods.has('Meta') !== e.metaKey) return false

    // Modifier-only binding (e.g. just pressing Shift)
    if (nonModKeys.length === 0) return true
    // Only a single non-modifier key is supported per binding
    if (nonModKeys.length !== 1) return false

    return e.key.toLowerCase() === nonModKeys[0].toLowerCase()
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Declaratively register global keyboard shortcuts.
 *
 * A single `keydown` listener is attached to `document` for all bindings.
 * The bindings array is stored in a ref so the listener never re-subscribes,
 * but always sees the latest callbacks — no stale-closure issues.
 *
 * @example
 * useKeyBindings([
 *   {
 *     keys: ['Control', 'k'],
 *     callback: () => setOpen((prev) => !prev),
 *     preventDefault: true,
 *     allowInInputs: true,
 *   },
 *   {
 *     keys: ['Escape'],
 *     callback: () => close(),
 *   },
 * ])
 */
const useKeyBindings = (bindings: KeyBinding[]): void => {
    const ref = useRef(bindings)

    useEffect(() => {
        ref.current = bindings
    })

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            for (const binding of ref.current) {
                if (!matchesBinding(e, binding.keys)) continue
                if (!binding.allowInInputs && isInputTarget(e)) continue

                if (binding.preventDefault) e.preventDefault()
                binding.callback(e)
            }
        }

        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [])
}

export type { KeyBinding }
export default useKeyBindings
