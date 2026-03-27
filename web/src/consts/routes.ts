import { Home, User, FileText, FolderKanban, BookOpen, Mail, type LucideIcon } from 'lucide-react'
import React from 'react'

const HomePage = React.lazy(() => import('@/pages/Home'))
const AboutPage = React.lazy(() => import('@/pages/About'))
const ResumePage = React.lazy(() => import('@/pages/Resume'))
const ProjectsPage = React.lazy(() => import('@/pages/Projects'))
const ProjectDetailPage = React.lazy(() => import('@/pages/PostPage'))
const ContactPage = React.lazy(() => import('@/pages/Contact'))

export const ROUTE = {
    HOME: 'home',
    ABOUT: 'about',
    RESUME: 'resume',
    PROJECTS: 'projects',
    BLOG: 'blog',
    CONTACT: 'contact',
    PROJECT_POST: 'project_post',
} as const

export type Route = typeof ROUTE[keyof typeof ROUTE]

export interface RouteDefinition {
    type: Route
    path: string
    /** Display label for navigation */
    label: string
    icon?: LucideIcon
    /** React page component rendered for this route (omit for external links) */
    component?: React.ComponentType
    /** Whether this route appears in the main navigation bar */
    showInMainNavigation?: boolean
    /** External URL — renders an `<a>` instead of a router link */
    externalUrl?: string
}

export const ROUTE_DEFINITIONS: Record<Route, RouteDefinition> = {
    [ROUTE.HOME]: { type: ROUTE.HOME, path: '/', label: 'Home', icon: Home, component: HomePage, showInMainNavigation: true },
    [ROUTE.ABOUT]: { type: ROUTE.ABOUT, path: '/about', label: 'About', icon: User, component: AboutPage, showInMainNavigation: true },
    [ROUTE.RESUME]: { type: ROUTE.RESUME, path: '/resume', label: 'Resume', icon: FileText, component: ResumePage, showInMainNavigation: true },
    [ROUTE.PROJECTS]: { type: ROUTE.PROJECTS, path: '/projects', label: 'Projects', icon: FolderKanban, component: ProjectsPage, showInMainNavigation: true },
    [ROUTE.BLOG]: { type: ROUTE.BLOG, path: '/blog', label: 'Blog', icon: BookOpen, externalUrl: 'https://blog.example.com', showInMainNavigation: true },
    [ROUTE.CONTACT]: { type: ROUTE.CONTACT, path: '/contact', label: 'Get in Touch', icon: Mail, component: ContactPage, showInMainNavigation: true },
    [ROUTE.PROJECT_POST]: { type: ROUTE.PROJECT_POST, path: '/projects/:slug', label: 'Projects', component: ProjectDetailPage },
}

/** Route keys that appear in the main navigation bar */
export const NAV_ROUTES = (Object.keys(ROUTE_DEFINITIONS) as Route[]).filter(
    (r) => ROUTE_DEFINITIONS[r].showInMainNavigation,
)
