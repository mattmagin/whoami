import { Home, FileText, FolderKanban, BookOpen, Mail, type LucideIcon } from 'lucide-react'

export const ROUTE = {
    HOME: 'home',
    RESUME: 'resume',
    PROJECTS: 'projects',
    BLOG: 'blog',
    CONTACT: 'contact',
    BLOG_POST: 'blog_post',
} as const

export type Route = typeof ROUTE[keyof typeof ROUTE]

export interface RouteDefinition {
    path: string
    /** Key into strings.json `nav` section */
    labelKey: 'home' | 'resume' | 'projects' | 'blog' | 'contact'
    icon?: LucideIcon
    /** Whether this route appears in the main navigation bar / command palette */
    showInMainNavigation?: boolean
    /** Single-key shortcuts (no modifiers) */
    shortcuts?: string[]
}

export const ROUTE_DEFINITIONS: Record<Route, RouteDefinition> = {
    [ROUTE.HOME]: { path: '/', labelKey: 'home', icon: Home, showInMainNavigation: true, shortcuts: ['h', '1'] },
    [ROUTE.RESUME]: { path: '/resume', labelKey: 'resume', icon: FileText, showInMainNavigation: true, shortcuts: ['r', '2'] },
    [ROUTE.PROJECTS]: { path: '/projects', labelKey: 'projects', icon: FolderKanban, showInMainNavigation: true, shortcuts: ['p', '3'] },
    [ROUTE.BLOG]: { path: '/blog', labelKey: 'blog', icon: BookOpen, showInMainNavigation: true, shortcuts: ['b', '4'] },
    [ROUTE.CONTACT]: { path: '/contact', labelKey: 'contact', icon: Mail, showInMainNavigation: true, shortcuts: ['c', '5'] },
    [ROUTE.BLOG_POST]: { path: '/blog/:slug', labelKey: 'blog' },
}

/** Route keys that appear in the main navigation bar / command palette */
export const NAV_ROUTES = (Object.keys(ROUTE_DEFINITIONS) as Route[]).filter(
    (r) => ROUTE_DEFINITIONS[r].showInMainNavigation,
)

/** Shortcut key → path lookup (for the global keyboard handler) */
export const NAV_SHORTCUTS: Record<string, string> = Object.fromEntries(
    NAV_ROUTES
        .map((r) => ROUTE_DEFINITIONS[r])
        .filter((d): d is RouteDefinition & { shortcuts: string[] } => !!d.shortcuts?.length)
        .flatMap((d) => d.shortcuts.map((key) => [key, d.path] as const)),
)
