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

/** Discriminator used by the unified PostPage to choose query hook + field mapping */
export type PostType = 'blog' | 'project'

export interface RouteDefinition {
    type: Route
    path: string
    /** Display label for navigation */
    label: string
    icon?: LucideIcon
    /** React page component rendered for this route */
    component: React.ComponentType
    /** Whether this route appears in the main navigation bar */
    showInMainNavigation?: boolean
    /** Post type discriminator for the unified PostPage */
    postType?: PostType
}

export const ROUTE_DEFINITIONS: Record<Route, RouteDefinition> = {
    [ROUTE.HOME]: { type: ROUTE.HOME, path: '/', label: 'Home', icon: Home, component: HomePage, showInMainNavigation: true },
    [ROUTE.RESUME]: { type: ROUTE.RESUME, path: '/resume', label: 'Resume', icon: FileText, component: ResumePage, showInMainNavigation: true },
    [ROUTE.PROJECTS]: { type: ROUTE.PROJECTS, path: '/projects', label: 'Projects', icon: FolderKanban, component: ProjectsPage, showInMainNavigation: true },
    [ROUTE.BLOG]: { type: ROUTE.BLOG, path: '/blog', label: 'Blog', icon: BookOpen, component: BlogPage, showInMainNavigation: true },
    [ROUTE.CONTACT]: { type: ROUTE.CONTACT, path: '/contact', label: 'Get in Touch', icon: Mail, component: ContactPage, showInMainNavigation: true },
    [ROUTE.BLOG_POST]: { type: ROUTE.BLOG_POST, path: '/blog/:slug', label: 'Blog', component: PostPage, postType: 'blog' },
    [ROUTE.PROJECT_POST]: { type: ROUTE.PROJECT_POST, path: '/projects/:slug', label: 'Projects', component: PostPage, postType: 'project' },
}

/** Route keys that appear in the main navigation bar */
export const NAV_ROUTES = (Object.keys(ROUTE_DEFINITIONS) as Route[]).filter(
    (r) => ROUTE_DEFINITIONS[r].showInMainNavigation,
)
