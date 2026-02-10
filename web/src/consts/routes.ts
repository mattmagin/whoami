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
    /** Single-key shortcut (no modifiers) */
    shortcut?: string
}

export const ROUTE_DEFINITIONS: Record<Route, RouteDefinition> = {
    [ROUTE.HOME]:      { path: '/',          labelKey: 'home',     icon: Home,         shortcut: 'h' },
    [ROUTE.RESUME]:    { path: '/resume',    labelKey: 'resume',   icon: FileText,     shortcut: 'r' },
    [ROUTE.PROJECTS]:  { path: '/projects',  labelKey: 'projects', icon: FolderKanban, shortcut: 'p' },
    [ROUTE.BLOG]:      { path: '/blog',      labelKey: 'blog',     icon: BookOpen,     shortcut: 'b' },
    [ROUTE.CONTACT]:   { path: '/contact',   labelKey: 'contact',  icon: Mail,         shortcut: 'c' },
    [ROUTE.BLOG_POST]: { path: '/blog/:slug', labelKey: 'blog' },
}

/** Only routes that appear in the nav bar / command palette */
export const NAV_ROUTES = [ROUTE.HOME, ROUTE.RESUME, ROUTE.PROJECTS, ROUTE.BLOG, ROUTE.CONTACT] as const

/** Shortcut key → path lookup (for the global keyboard handler) */
export const NAV_SHORTCUTS: Record<string, string> = Object.fromEntries(
    NAV_ROUTES
        .map((r) => ROUTE_DEFINITIONS[r])
        .filter((d): d is RouteDefinition & { shortcut: string } => !!d.shortcut)
        .map((d) => [d.shortcut, d.path]),
)
