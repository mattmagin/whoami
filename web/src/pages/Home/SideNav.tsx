import { useEffect, useState, useCallback } from 'react'
import { NAV_ROUTES, ROUTE, ROUTE_DEFINITIONS } from '@/consts'
import { useContent } from '@/providers/ContentProvider'
import { cn } from '@/lib/utils'

/** Nav routes displayed in the side nav (everything except Home) */
const SIDE_NAV_ROUTES = NAV_ROUTES.filter((r) => r !== ROUTE.HOME)

interface SideNavProps {
    onNavigate: (path: string) => void
    onBack?: () => void
    className?: string
}

const SideNav = ({ onNavigate, onBack, className }: SideNavProps) => {
    const { nav } = useContent()
    const [focusedIndex, setFocusedIndex] = useState(-1)

    const navigate = useCallback(
        (index: number) => {
            const route = SIDE_NAV_ROUTES[index]
            if (route) {
                onNavigate(ROUTE_DEFINITIONS[route].path)
            }
        },
        [onNavigate],
    )

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't capture when user is typing in an input or the command palette is open
            const tag = (e.target as HTMLElement)?.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA') return

            const count = SIDE_NAV_ROUTES.length

            switch (e.key) {
                case 'ArrowDown':
                case 'j': {
                    e.preventDefault()
                    setFocusedIndex((prev) => (prev + 1) % count)
                    break
                }
                case 'ArrowUp':
                case 'k': {
                    e.preventDefault()
                    setFocusedIndex((prev) => (prev - 1 + count) % count)
                    break
                }
                case 'Enter':
                case 'ArrowRight':
                case 'l': {
                    setFocusedIndex((current) => {
                        if (current >= 0 && current < count) {
                            navigate(current)
                        }
                        return current
                    })
                    break
                }
                case 'ArrowLeft':
                case 'h':
                case 'Escape': {
                    e.preventDefault()
                    onBack?.()
                    break
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [navigate])

    return (
        <nav
            className={cn(
                'hidden lg:flex flex-col gap-5 shrink-0',
                className,
            )}
        >
            {SIDE_NAV_ROUTES.map((route, index) => {
                const { path, labelKey } = ROUTE_DEFINITIONS[route]
                const label = nav[labelKey]
                const isFocused = index === focusedIndex
                const number = String(index + 1).padStart(2, '0')

                return (
                    <button
                        key={path}
                        onClick={() => {
                            setFocusedIndex(index)
                            onNavigate(path)
                        }}
                        className={cn(
                            'flex items-center gap-3 font-mono text-base uppercase tracking-widest transition-all duration-200 text-left',
                            isFocused
                                ? 'text-foreground font-bold scale-105 origin-left'
                                : 'text-muted-foreground/60 hover:text-muted-foreground',
                        )}
                    >
                        <span>{number}</span>
                        <span className="text-muted-foreground/40">—</span>
                        <span>{label}</span>
                    </button>
                )
            })}
        </nav>
    )
}

export default SideNav
