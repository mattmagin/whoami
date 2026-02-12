import { NAV_ROUTES, ROUTE_DEFINITIONS, type Route } from '@/consts'
import { useContent } from '@/providers/ContentProvider'
import { cn } from '@/lib/utils'

/** Nav routes displayed in the side nav (all nav routes including Home) */
const SIDE_NAV_ROUTES = NAV_ROUTES

interface SideNavProps {
    /** Currently active route — always highlighted regardless of focus */
    currentRoute: Route
    onNavigate: (path: string) => void
    className?: string
}

const SideNav = ({ currentRoute, onNavigate, className }: SideNavProps) => {
    const { nav } = useContent()

    return (
        <nav
            className={cn(
                'hidden lg:flex flex-col gap-5 shrink-0 border-l border-primary/30 pl-6',
                className,
            )}
        >
            {SIDE_NAV_ROUTES.map((route, index) => {
                const { path, labelKey } = ROUTE_DEFINITIONS[route]
                const label = nav[labelKey]
                const isCurrent = route === currentRoute
                const number = String(index).padStart(2, '0')

                return (
                    <button
                        key={path}
                        onClick={() => onNavigate(path)}
                        className={cn(
                            'flex items-center gap-3 font-mono text-base uppercase tracking-widest transition-all duration-200 text-left',
                            isCurrent
                                ? 'text-primary font-semibold'
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
