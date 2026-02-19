import { useState, useRef, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Github, Linkedin, Menu } from 'lucide-react'
import { NAV_ROUTES, ROUTE, ROUTE_DEFINITIONS, type Route } from '@/consts'
import { getPosts, getProjects, getResume } from '@/api'
import { useResume } from '@/hooks/queries'

/** Nav routes excluding Home (the name/logo serves as the home link) */
const TOP_NAV_ROUTES = NAV_ROUTES.filter((r) => r !== ROUTE.HOME)

/** Map child routes (individual posts) to their parent nav route for highlight */
const PARENT_ROUTE: Partial<Record<Route, Route>> = {
    [ROUTE.BLOG_POST]: ROUTE.BLOG,
    [ROUTE.PROJECT_POST]: ROUTE.PROJECTS,
}
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetTitle,
} from '@/components/ui/sheet'

/** Map nav routes to query prefetch configs */
const PREFETCH_MAP: Partial<Record<Route, { queryKey: string[]; queryFn: () => Promise<unknown> }>> = {
    [ROUTE.PROJECTS]: { queryKey: ['projects'], queryFn: () => getProjects({ page: 1 }) },
    [ROUTE.BLOG]: { queryKey: ['posts'], queryFn: () => getPosts({ page: 1 }) },
    [ROUTE.RESUME]: { queryKey: ['resume'], queryFn: getResume },
}

interface TopNavProps {
    /** Currently active route — always highlighted */
    currentRoute: Route
    onNavigate: (path: string) => void
    className?: string
}

const TopNav = ({ currentRoute, onNavigate, className }: TopNavProps) => {
    const { data: resume } = useResume()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const queryClient = useQueryClient()

    // Track reading progress as a scroll percentage
    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
            setScrollProgress(Math.min(100, Math.max(0, percent)))
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll() // Initial call
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Refs for measuring button positions
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRefs = useRef<Map<Route, HTMLButtonElement>>(new Map())
    const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)

    const updateIndicator = useCallback(() => {
        const container = containerRef.current
        const activeButton = buttonRefs.current.get(PARENT_ROUTE[currentRoute] ?? currentRoute)
        if (!container || !activeButton) {
            setIndicator(null)
            return
        }

        const containerRect = container.getBoundingClientRect()
        const buttonRect = activeButton.getBoundingClientRect()

        setIndicator({
            left: buttonRect.left - containerRect.left,
            width: buttonRect.width,
        })
    }, [currentRoute])

    useEffect(() => {
        updateIndicator()
        // Re-measure on resize (e.g. zoom changes)
        window.addEventListener('resize', updateIndicator)
        // Re-measure after fonts finish loading (prevents indicator misalignment)
        document.fonts.ready.then(updateIndicator)
        return () => window.removeEventListener('resize', updateIndicator)
    }, [updateIndicator])

    const handleNav = (path: string) => {
        setDrawerOpen(false)
        onNavigate(path)
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
    }

    /** Prefetch query data on hover / focus so it's cached by click time */
    const handlePrefetch = useCallback((route: Route) => {
        const config = PREFETCH_MAP[route]
        if (!config) return
        queryClient.prefetchQuery({
            queryKey: config.queryKey,
            queryFn: config.queryFn,
        })
    }, [queryClient])

    const githubUrl = resume?.contact?.github ? `https://${resume.contact.github}` : undefined
    const linkedinUrl = resume?.contact?.linkedin ? `https://${resume.contact.linkedin}` : undefined

    return (
        <header
            className={cn(
                'relative sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md transition-colors duration-200',
                className,
            )}
        >
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10 lg:px-16">
                {/* Left — Name / Home link */}
                <button
                    onClick={() => handleNav('/')}
                    style={{ fontFamily: 'var(--font-mono)' }}
                    className="text-lg font-bold text-primary transition-colors hover:text-primary/80 shrink-0"
                >
                    {resume?.name}
                </button>

                {/* Center — Desktop nav items */}
                <div ref={containerRef} className="relative hidden md:flex items-center gap-8">
                    {TOP_NAV_ROUTES.map((route, index) => {
                        const { path, label } = ROUTE_DEFINITIONS[route]
                        const isCurrent = route === currentRoute || route === PARENT_ROUTE[currentRoute]
                        const number = String(index + 1).padStart(2, '0')

                        return (
                            <button
                                key={path}
                                ref={(el) => {
                                    if (el) buttonRefs.current.set(route, el)
                                }}
                                onClick={() => handleNav(path)}
                                onMouseEnter={() => handlePrefetch(route)}
                                onFocus={() => handlePrefetch(route)}
                                style={{ fontFamily: 'var(--font-mono)' }}
                                className={cn(
                                    'flex items-center gap-2 text-sm tracking-wider transition-colors duration-200 py-1',
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

                    {/* Sliding underline indicator */}
                    {indicator && (
                        <span
                            className="absolute bottom-0 h-[2px] bg-primary rounded-full transition-all duration-300 ease-in-out"
                            style={{ left: indicator.left, width: indicator.width }}
                        />
                    )}
                </div>

                {/* Right — Social icons + mobile hamburger */}
                <div className="flex items-center gap-4 shrink-0">
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:block text-muted-foreground/70 transition-colors hover:text-primary"
                            aria-label="GitHub"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    )}
                    {linkedinUrl && (
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:block text-muted-foreground/70 transition-colors hover:text-primary"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                    )}

                    {/* Mobile hamburger */}
                    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                        <SheetTrigger asChild>
                            <button
                                className="md:hidden text-muted-foreground hover:text-primary transition-colors"
                                aria-label="Toggle menu"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-64 pt-12">
                            <SheetTitle className="sr-only">Navigation</SheetTitle>
                            <nav className="flex flex-col gap-6 px-4">
                                {TOP_NAV_ROUTES.map((route, index) => {
                                    const { path, label } = ROUTE_DEFINITIONS[route]
                                    const isCurrent = route === currentRoute || route === PARENT_ROUTE[currentRoute]
                                    const number = String(index + 1).padStart(2, '0')

                                    return (
                                        <button
                                            key={path}
                                            onClick={() => handleNav(path)}
                                            onFocus={() => handlePrefetch(route)}
                                            style={{ fontFamily: 'var(--font-mono)' }}
                                            className={cn(
                                                'flex items-center gap-3 text-base tracking-widest transition-all duration-200 text-left',
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

                                {/* Social links in drawer */}
                                <div className="flex items-center gap-4 pt-4 border-t border-primary/10">
                                    {githubUrl && (
                                        <a
                                            href={githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground/70 transition-colors hover:text-primary"
                                            aria-label="GitHub"
                                        >
                                            <Github className="h-5 w-5" />
                                        </a>
                                    )}
                                    {linkedinUrl && (
                                        <a
                                            href={linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground/70 transition-colors hover:text-primary"
                                            aria-label="LinkedIn"
                                        >
                                            <Linkedin className="h-5 w-5" />
                                        </a>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>

            {/* Reading progress bar — post, project, and resume pages */}
            {(currentRoute === ROUTE.BLOG_POST || currentRoute === ROUTE.PROJECT_POST || currentRoute === ROUTE.RESUME) && (
                <Progress
                    value={scrollProgress}
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-none bg-transparent"
                />
            )}
        </header>
    )
}

export default TopNav
