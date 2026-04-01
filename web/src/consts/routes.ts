import { Home, User, FileText, FolderKanban, BookOpen, Mail, type LucideIcon } from 'lucide-react'
import React from 'react'

const HomePage = React.lazy(() => import('@/pages/Home'))
const ResumePage = React.lazy(() => import('@/pages/Resume'))
const ProjectsPage = React.lazy(() => import('@/pages/Projects'))
const ProjectDetailPage = React.lazy(() => import('@/pages/PostPage'))
const ContactPage = React.lazy(() => import('@/pages/Contact'))
const PDFViewerPage = React.lazy(() => import('@/pages/PDFViewer'))

export const ROUTE = {
    HOME: 'home',
    RESUME: 'resume',
    PROJECTS: 'projects',
    BLOG: 'blog',
    CONTACT: 'contact',
    PROJECT_POST: 'project_post',
    RESUME_PDF: 'resume_pdf',
} as const

export type Route = typeof ROUTE[keyof typeof ROUTE]

export interface RouteDefinition {
    type: Route
    path: string
    label: string
    icon?: LucideIcon
    component?: React.ComponentType
    showInMainNavigation?: boolean
    navigationVariant?: 'primary' | 'ghost' | 'link' //TODO: import from Button component
    disabled?: boolean
    chromeless?: boolean
}

export const ROUTE_DEFINITIONS: Record<Route, RouteDefinition> = {
    [ROUTE.HOME]: { type: ROUTE.HOME, path: '/', label: 'Home', icon: Home, component: HomePage, showInMainNavigation: true },
    [ROUTE.RESUME]: { type: ROUTE.RESUME, path: '/resume', label: 'Resume', icon: FileText, component: ResumePage, showInMainNavigation: true },
    [ROUTE.PROJECTS]: { type: ROUTE.PROJECTS, path: '/projects', label: 'Projects', icon: FolderKanban, component: ProjectsPage, showInMainNavigation: true },
    [ROUTE.BLOG]: { type: ROUTE.BLOG, path: '/blog', label: 'Blog', icon: BookOpen, disabled: true },
    [ROUTE.CONTACT]: { type: ROUTE.CONTACT, path: '/contact', label: 'Get in Touch', icon: Mail, component: ContactPage, showInMainNavigation: true, navigationVariant: 'primary' },
    [ROUTE.PROJECT_POST]: { type: ROUTE.PROJECT_POST, path: '/projects/:slug', label: 'Projects', component: ProjectDetailPage },
    [ROUTE.RESUME_PDF]: { type: ROUTE.RESUME_PDF, path: '/resume/pdf', label: 'Resume PDF', component: PDFViewerPage, chromeless: true },
}

/** Route keys that appear in the main navigation bar */
export const NAV_ROUTES = (Object.keys(ROUTE_DEFINITIONS) as Route[]).filter(
    (r) => ROUTE_DEFINITIONS[r].showInMainNavigation && !ROUTE_DEFINITIONS[r].disabled,
)
