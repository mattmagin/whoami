import { useState } from 'react'
import { Menu } from 'lucide-react'
import { NAV_ROUTES, ROUTE, ROUTE_DEFINITIONS, type Route } from '@/consts'
import { useContent } from '@/providers/ContentProvider'
import { cn } from '@/lib/utils'
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetTitle,
} from '@/components/ui/sheet'

/** Top-nav routes exclude Home (logo serves as the home link) */
const TOP_NAV_ROUTES = NAV_ROUTES.filter((r) => r !== ROUTE.HOME)

interface TopNavProps {
    /** Currently active route — always highlighted */
    currentRoute: Route
    onNavigate: (path: string) => void
    className?: string
}

const TopNav = ({ currentRoute, onNavigate, className }: TopNavProps) => {
    const { nav, aria } = useContent()
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleNav = (path: string) => {
        setDrawerOpen(false)
        onNavigate(path)
    }

    return (
        <header
            className={cn(
                'sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-primary/10 transition-colors duration-200',
                className,
            )}
        >
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10 lg:px-16">
                {/* Logo / Home link */}
                <button
                    onClick={() => handleNav('/')}
                    className="font-mono text-lg font-bold text-primary transition-colors hover:text-primary/80"
                >
                    {nav.home}
                </button>

                {/* Desktop nav items */}
                <div className="hidden md:flex items-center gap-8">
                    {TOP_NAV_ROUTES.map((route, index) => {
                        const { path, labelKey } = ROUTE_DEFINITIONS[route]
                        const label = nav[labelKey]
                        const isCurrent = route === currentRoute
                        const number = String(index + 1).padStart(2, '0')

                        return (
                            <button
                                key={path}
                                onClick={() => handleNav(path)}
                                className={cn(
                                    'flex items-center gap-2 font-mono text-sm tracking-wider transition-all duration-200',
                                    isCurrent
                                        ? 'text-primary font-semibold'
                                        : 'text-muted-foreground/70 hover:text-primary',
                                )}
                            >
                                <span className="text-primary">{number}.</span>
                                <span>{label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Mobile hamburger */}
                <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <SheetTrigger asChild>
                        <button
                            className="md:hidden text-muted-foreground hover:text-primary transition-colors"
                            aria-label={aria.toggleMenu}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-64 pt-12">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <nav className="flex flex-col gap-6 px-4">
                            {/* Home link in drawer */}
                            <button
                                onClick={() => handleNav('/')}
                                className={cn(
                                    'flex items-center gap-3 font-mono text-base tracking-widest transition-all duration-200 text-left',
                                    currentRoute === ROUTE.HOME
                                        ? 'text-primary font-semibold'
                                        : 'text-muted-foreground/70 hover:text-primary',
                                )}
                            >
                                <span className="text-primary">00.</span>
                                <span>{nav.home}</span>
                            </button>

                            {TOP_NAV_ROUTES.map((route, index) => {
                                const { path, labelKey } = ROUTE_DEFINITIONS[route]
                                const label = nav[labelKey]
                                const isCurrent = route === currentRoute
                                const number = String(index + 1).padStart(2, '0')

                                return (
                                    <button
                                        key={path}
                                        onClick={() => handleNav(path)}
                                        className={cn(
                                            'flex items-center gap-3 font-mono text-base tracking-widest transition-all duration-200 text-left',
                                            isCurrent
                                                ? 'text-primary font-semibold'
                                                : 'text-muted-foreground/70 hover:text-primary',
                                        )}
                                    >
                                        <span className="text-primary">{number}.</span>
                                        <span>{label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>
            </nav>
        </header>
    )
}

export default TopNav
