import { Home, FileText, FolderKanban, BookOpen, Mail, type LucideIcon } from 'lucide-react'
import React from 'react'

const HomePage = React.lazy(() => import('@/pages/Home'))
const ResumePage = React.lazy(() => import('@/pages/Resume'))
const ProjectsPage = React.lazy(() => import('@/pages/Projects'))
const BlogPage = React.lazy(() => import('@/pages/Blog'))
const BlogPostPage = React.lazy(() => import('@/pages/BlogPost'))
const ProjectPostPage = React.lazy(() => import('@/pages/ProjectPost'))
const ContactPage = React.lazy(() => import('@/pages/Contact'))

export const ROUTE = {
    HOME: 'home',
    RESUME: 'resume',
    PROJECTS: 'projects',
    BLOG: 'blog',
    CONTACT: 'contact',
    BLOG_POST: 'blog_post',
    PROJECT_POST: 'project_post',
} as const

export type Route = typeof ROUTE[keyof typeof ROUTE]

export interface RouteDefinition {
    path: string
    /** Key into strings.json `nav` section */
    labelKey: 'home' | 'resume' | 'projects' | 'blog' | 'contact'
    icon?: LucideIcon
    /** React page component rendered for this route */
    component: React.ComponentType
    /** Whether this route appears in the main navigation bar / command palette */
    showInMainNavigation?: boolean
    /** Single-key shortcuts (no modifiers) */
    shortcuts?: string[]
}

export const ROUTE_DEFINITIONS: Record<Route, RouteDefinition> = {
    [ROUTE.HOME]: { path: '/', labelKey: 'home', icon: Home, component: HomePage, showInMainNavigation: true, shortcuts: ['h', '1'] },
    [ROUTE.RESUME]: { path: '/resume', labelKey: 'resume', icon: FileText, component: ResumePage, showInMainNavigation: true, shortcuts: ['r', '2'] },
    [ROUTE.PROJECTS]: { path: '/projects', labelKey: 'projects', icon: FolderKanban, component: ProjectsPage, showInMainNavigation: true, shortcuts: ['p', '3'] },
    [ROUTE.BLOG]: { path: '/blog', labelKey: 'blog', icon: BookOpen, component: BlogPage, showInMainNavigation: true, shortcuts: ['b', '4'] },
    [ROUTE.CONTACT]: { path: '/contact', labelKey: 'contact', icon: Mail, component: ContactPage, showInMainNavigation: true, shortcuts: ['c', '5'] },
    [ROUTE.BLOG_POST]: { path: '/blog/:slug', labelKey: 'blog', component: BlogPostPage },
    [ROUTE.PROJECT_POST]: { path: '/projects/:slug', labelKey: 'projects', component: ProjectPostPage },
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
