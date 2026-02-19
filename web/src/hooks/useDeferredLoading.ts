import { useState, useEffect } from 'react'

/**
 * Suppresses a loading flag for a short delay to avoid skeleton flash.
 *
 * If the underlying query resolves within `delay` ms the skeleton is
 * never shown — the content simply appears with the page-enter animation.
 * For slower requests the skeleton kicks in after the delay.
 */
const useDeferredLoading = (isLoading: boolean, delay = 200): boolean => {
    const [showLoading, setShowLoading] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            setShowLoading(false)
            return
        }

        const timer = setTimeout(() => setShowLoading(true), delay)
        return () => clearTimeout(timer)
    }, [isLoading, delay])

    return showLoading
}

export default useDeferredLoading
