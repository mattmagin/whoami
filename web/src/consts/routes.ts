import { Home, FileText, FolderKanban, BookOpen, Mail, type LucideIcon } from 'lucide-react'
import React from 'react'

const HomePage = React.lazy(() => import('@/pages/Home'))
const ResumePage = React.lazy(() => import('@/pages/Resume'))
const ProjectsPage = React.lazy(() => import('@/pages/Projects'))
const BlogPage = React.lazy(() => import('@/pages/Blog'))
const PostPage = React.lazy(() => import('@/pages/PostPage'))
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

/** Top-level keys in strings.json that contain a `title` and `description` */
export type HeaderContentSection = 'blog' | 'projects' | 'contact' | 'resume'

/** Discriminator used by the unified PostPage to choose query hook + field mapping */
export type PostType = 'blog' | 'project'

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
    /** Top-level key in strings.json whose .title / .description to display in the page header */
    headerContentSection?: HeaderContentSection
    /** Post type discriminator for the unified PostPage */
    postType?: PostType
}

export const ROUTE_DEFINITIONS: Record<Route, RouteDefinition> = {
    [ROUTE.HOME]: { path: '/', labelKey: 'home', icon: Home, component: HomePage, showInMainNavigation: true, shortcuts: ['0'] },
    [ROUTE.RESUME]: { path: '/resume', labelKey: 'resume', icon: FileText, component: ResumePage, showInMainNavigation: true, shortcuts: ['1'], headerContentSection: 'resume' },
    [ROUTE.PROJECTS]: { path: '/projects', labelKey: 'projects', icon: FolderKanban, component: ProjectsPage, showInMainNavigation: true, shortcuts: ['2'], headerContentSection: 'projects' },
    [ROUTE.BLOG]: { path: '/blog', labelKey: 'blog', icon: BookOpen, component: BlogPage, showInMainNavigation: true, shortcuts: ['3'], headerContentSection: 'blog' },
    [ROUTE.CONTACT]: { path: '/contact', labelKey: 'contact', icon: Mail, component: ContactPage, showInMainNavigation: true, shortcuts: ['4'], headerContentSection: 'contact' },
    [ROUTE.BLOG_POST]: { path: '/blog/:slug', labelKey: 'blog', component: PostPage, headerContentSection: 'blog', postType: 'blog' },
    [ROUTE.PROJECT_POST]: { path: '/projects/:slug', labelKey: 'projects', component: PostPage, headerContentSection: 'projects', postType: 'project' },
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
