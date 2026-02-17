import { useState, useEffect, useRef } from 'react'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface TypewriterOptions {
    /** Milliseconds per character when deleting (default 20) */
    deleteSpeed?: number
    /** Milliseconds per character when typing (default 35) */
    typeSpeed?: number
    /** Pause in ms between delete and type phases (default 80) */
    pauseBetween?: number
}

/**
 * Animates text transitions with a typewriter backspace-then-type effect.
 *
 * On first mount, types in from empty. When `target` changes, backspaces the
 * current text then types the new value. Returns the string to render plus
 * an `isAnimating` flag so callers can keep components mounted until exit
 * animations finish.
 */
const useTypewriter = (
    target: string,
    { deleteSpeed = 20, typeSpeed = 35, pauseBetween = 80 }: TypewriterOptions = {},
) => {
    const [displayed, setDisplayed] = useState('')
    const [isAnimating, setIsAnimating] = useState(target.length > 0)
    const displayedRef = useRef('')

    useEffect(() => {
        if (target === displayedRef.current) {
            return
        }

        setIsAnimating(true)
        let cancelled = false

        const animate = async () => {
            const current = displayedRef.current
            for (let i = current.length - 1; i >= 0; i--) {
                if (cancelled) return
                const text = current.slice(0, i)
                displayedRef.current = text
                setDisplayed(text)
                await wait(deleteSpeed)
            }
            if (!cancelled) {
                displayedRef.current = ''
                setDisplayed('')
            }

            if (cancelled) return
            if (target.length > 0) {
                await wait(pauseBetween)
            }

            for (let i = 1; i <= target.length; i++) {
                if (cancelled) return
                const text = target.slice(0, i)
                displayedRef.current = text
                setDisplayed(text)
                if (i < target.length) await wait(typeSpeed)
            }

            if (!cancelled) {
                setIsAnimating(false)
            }
        }

        animate()
        return () => { cancelled = true }
    }, [target, deleteSpeed, typeSpeed, pauseBetween])

    return { displayedText: displayed, isAnimating }
}

export default useTypewriter

// ---------------------------------------------------------------------------
// Coordinated two-line typewriter (heading + subheading)
// ---------------------------------------------------------------------------

export interface PageTypewriterOptions {
    deleteSpeed?: number
    typeSpeed?: number
    pauseBetween?: number
}

interface PageTypewriterState {
    heading: string
    subheading: string
    isAnimating: boolean
    /** True only while the heading is being backspaced or typed */
    headingActive: boolean
}

/**
 * Coordinated typewriter for a heading + subheading pair.
 *
 * Sequence on change:
 *   1. Backspace subheading
 *   2. Backspace heading
 *   3. Type new heading
 *   4. Type new subheading
 */
export const usePageTypewriter = (
    targetHeading: string,
    targetSubheading: string,
    { deleteSpeed = 20, typeSpeed = 35, pauseBetween = 80 }: PageTypewriterOptions = {},
): PageTypewriterState => {
    const [heading, setHeading] = useState('')
    const [subheading, setSubheading] = useState('')
    const [isAnimating, setIsAnimating] = useState(
        targetHeading.length > 0 || targetSubheading.length > 0,
    )
    const [headingActive, setHeadingActive] = useState(false)

    const headingRef = useRef('')
    const subheadingRef = useRef('')

    useEffect(() => {
        if (
            targetHeading === headingRef.current &&
            targetSubheading === subheadingRef.current
        ) {
            return
        }

        setIsAnimating(true)
        let cancelled = false

        const set = (
            ref: React.MutableRefObject<string>,
            setter: React.Dispatch<React.SetStateAction<string>>,
            value: string,
        ) => {
            ref.current = value
            setter(value)
        }

        const backspace = async (
            ref: React.MutableRefObject<string>,
            setter: React.Dispatch<React.SetStateAction<string>>,
            speed: number,
        ) => {
            const current = ref.current
            for (let i = current.length - 1; i >= 0; i--) {
                if (cancelled) return
                set(ref, setter, current.slice(0, i))
                await wait(speed)
            }
            if (!cancelled) set(ref, setter, '')
        }

        const typeIn = async (
            ref: React.MutableRefObject<string>,
            setter: React.Dispatch<React.SetStateAction<string>>,
            target: string,
            speed: number,
        ) => {
            for (let i = 1; i <= target.length; i++) {
                if (cancelled) return
                set(ref, setter, target.slice(0, i))
                if (i < target.length) await wait(speed)
            }
        }

        const subDeleteSpeed = Math.round(deleteSpeed / 2)
        const subTypeSpeed = Math.round(typeSpeed / 2)

        const animate = async () => {
            // Phase 1: backspace subheading (2× speed)
            await backspace(subheadingRef, setSubheading, subDeleteSpeed)
            if (cancelled) return

            // Phase 2: backspace heading
            if (!cancelled) setHeadingActive(true)
            await backspace(headingRef, setHeading, deleteSpeed)
            if (cancelled) return

            // Pause
            if (targetHeading.length > 0 || targetSubheading.length > 0) {
                await wait(pauseBetween)
            }
            if (cancelled) return

            // Phase 3: type heading
            await typeIn(headingRef, setHeading, targetHeading, typeSpeed)
            if (!cancelled) setHeadingActive(false)
            if (cancelled) return

            // Phase 4: type subheading (2× speed)
            await typeIn(subheadingRef, setSubheading, targetSubheading, subTypeSpeed)
            if (cancelled) return

            setIsAnimating(false)
        }

        animate()
        return () => { cancelled = true }
    }, [targetHeading, targetSubheading, deleteSpeed, typeSpeed, pauseBetween])

    return { heading, subheading, isAnimating, headingActive }
}
