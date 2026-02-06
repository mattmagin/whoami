import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, MapPin, Globe, Github, Linkedin } from 'lucide-react'
import type { ReactNode } from 'react'

interface ResumeRendererProps {
    content: string
}

// Track section context for conditional rendering
type SectionContext = 'header' | 'summary' | 'skills' | 'content'

const getSectionFromHeading = (text: string): SectionContext => {
    const lower = text.toLowerCase()
    if (lower === 'skills') return 'skills'
    return 'content'
}

// Parse "**Company** | Date" pattern from paragraph children
const parseCompanyDate = (children: ReactNode): { company: string; date: string } | null => {
    if (!Array.isArray(children)) return null

    const parts: string[] = []
    children.forEach((child) => {
        if (typeof child === 'string') {
            parts.push(child)
        } else if (child && typeof child === 'object' && 'props' in child) {
            // This is a React element (likely <strong>)
            parts.push(String(child.props.children || ''))
        }
    })

    const text = parts.join('')
    const pipeIndex = text.indexOf('|')
    if (pipeIndex === -1) return null

    return {
        company: text.slice(0, pipeIndex).trim(),
        date: text.slice(pipeIndex + 1).trim(),
    }
}

// Icon mapping for contact table
const contactIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    email: Mail,
    location: MapPin,
    website: Globe,
    github: Github,
    linkedin: Linkedin,
}

const ResumeRenderer = ({ content }: ResumeRendererProps) => {
    // Track current section for context-aware rendering
    let currentSection: SectionContext = 'header'
    let isFirstH2 = true
    let isFirstParagraph = true
    let isFirstTable = true

    const components: Components = {
        // H1 = Name
        h1: ({ children }) => (
            <h1 className="mb-2 font-serif text-4xl font-bold tracking-tight">
                {children}
            </h1>
        ),

        // H2 = Title (first one) or Section headers
        h2: ({ children }) => {
            if (isFirstH2) {
                isFirstH2 = false
                return (
                    <p className="text-xl text-muted-foreground">{children}</p>
                )
            }

            // Update section context based on heading text
            const headingText = String(children)
            currentSection = getSectionFromHeading(headingText)

            return (
                <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
                    {children}
                </h2>
            )
        },

        // H3 = Job/Education titles with dot indicator
        h3: ({ children }) => (
            <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary/50">
                <h3 className="font-semibold text-foreground">{children}</h3>
            </div>
        ),

        // Tables: Contact info (first) or Skills grid
        table: ({ children }) => {
            if (isFirstTable) {
                isFirstTable = false
                // Contact info table - render as flex items with icons
                return (
                    <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {children}
                    </div>
                )
            }

            // Skills table
            if (currentSection === 'skills') {
                return (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {children}
                    </div>
                )
            }

            // Default table rendering
            return <table className="w-full">{children}</table>
        },

        thead: () => null, // Hide table headers

        tbody: ({ children }) => <>{children}</>,

        tr: ({ children }) => {
            const cells = Array.isArray(children) ? children : [children]

            // For contact table (first table)
            if (isFirstTable === false && currentSection === 'header') {
                return <>{children}</>
            }

            // For skills table
            if (currentSection === 'skills') {
                // Extract category and items from cells
                const cellContents: string[] = []
                cells.forEach((cell) => {
                    if (cell && typeof cell === 'object' && 'props' in cell) {
                        cellContents.push(String(cell.props.children || ''))
                    }
                })

                if (cellContents.length >= 2) {
                    const category = cellContents[0]
                    const items = cellContents[1].split(',').map((s) => s.trim()).filter(Boolean)

                    return (
                        <div>
                            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {items.map((skill) => (
                                    <Badge key={skill} variant="outline" className="font-mono text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )
                }
            }

            return <tr>{children}</tr>
        },

        td: ({ children }) => {
            const text = String(children || '').trim()

            // For contact table, render with icons
            if (currentSection === 'header') {
                const lowerText = text.toLowerCase()
                const IconComponent = contactIcons[lowerText]

                if (IconComponent) {
                    // This is a label cell, skip it (we'll use the icon instead)
                    return null
                }

                // This is a value cell - find what type based on content
                let icon = null
                let href: string | undefined

                if (text.includes('@')) {
                    icon = <Mail className="h-4 w-4" />
                    href = `mailto:${text}`
                } else if (text.includes('github.com')) {
                    icon = <Github className="h-4 w-4" />
                    href = `https://${text}`
                } else if (text.includes('linkedin.com')) {
                    icon = <Linkedin className="h-4 w-4" />
                    href = `https://${text}`
                } else if (text.includes('.com') || text.includes('.io') || text.includes('.dev')) {
                    icon = <Globe className="h-4 w-4" />
                    href = `https://${text}`
                } else if (text.length > 0 && !text.includes('http')) {
                    // Assume location
                    icon = <MapPin className="h-4 w-4" />
                }

                if (icon) {
                    if (href) {
                        return (
                            <a
                                href={href}
                                target={href.startsWith('mailto') ? undefined : '_blank'}
                                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                                className="flex items-center gap-1 hover:text-foreground transition-colors"
                            >
                                {icon}
                                {text}
                            </a>
                        )
                    }
                    return (
                        <span className="flex items-center gap-1">
                            {icon}
                            {text}
                        </span>
                    )
                }
            }

            return <td className="py-1 pr-4">{children}</td>
        },

        // Horizontal rules become Separators
        hr: () => <Separator className="my-12" />,

        // Paragraphs - handle summary and company/date patterns
        p: ({ children }) => {
            // Check for "**Company** | Date" pattern (starts with strong element)
            const companyDate = parseCompanyDate(children as ReactNode)
            if (companyDate) {
                return (
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between pl-6 -mt-1">
                        <p className="text-muted-foreground">{companyDate.company}</p>
                        <span className="text-sm text-muted-foreground">{companyDate.date}</span>
                    </div>
                )
            }

            // First paragraph after header is the summary
            if (isFirstParagraph && currentSection === 'header') {
                isFirstParagraph = false
                return (
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {children}
                    </p>
                )
            }

            // Regular paragraph (description)
            return (
                <p className="mt-2 text-sm text-muted-foreground pl-6">
                    {children}
                </p>
            )
        },

        // Lists for highlights
        ul: ({ children }) => (
            <ul className="mt-3 space-y-1 pl-6">{children}</ul>
        ),

        li: ({ children }) => (
            <li className="text-sm text-muted-foreground before:mr-2 before:content-['•']">
                {children}
            </li>
        ),

        // Strong text (bold)
        strong: ({ children }) => <strong>{children}</strong>,
    }

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
        </ReactMarkdown>
    )
}

export default ResumeRenderer
