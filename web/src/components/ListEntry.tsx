import { Link } from 'react-router-dom'
import { Calendar, Clock, ExternalLink, Github } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge, Button, Text } from '@/components/ui'
import type { Post, Project } from '@/types'
import { useContent } from '@/providers/ContentProvider'

type ListEntryProps =
    | { type: 'post'; item: Post }
    | { type: 'project'; item: Project }

const ListEntry = (props: ListEntryProps) => {
    const { common } = useContent()!
    const { type, item } = props

    const href = type === 'post' ? `/blog/${item.slug}` : `/projects/${item.slug}`
    const title = type === 'post' ? item.title : item.name
    const description = item.excerpt
    const imageUrl = type === 'post' ? item.featureImageUrl : item.imageUrl

    const formattedDate =
        item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
            : null

    const tags = type === 'post' ? item.tags : null
    const readingTime = type === 'post' ? item.readingTime : null
    const techStack = type === 'project' ? item.techStack : null
    const githubUrl = type === 'project' ? item.githubUrl : null
    const projectUrl = type === 'project' ? item.url : null

    return (
        <article
            className={cn(
                'group rounded-lg border-l-2 transition-all duration-200',
                'border-l-transparent pl-4',
            )}
        >
            <Link to={href} className="flex gap-5 py-4 no-underline">
                {/* Thumbnail */}
                {imageUrl && (
                    <div className="hidden shrink-0 overflow-hidden rounded-md sm:block">
                        <img
                            src={imageUrl}
                            alt={title ?? ''}
                            className="h-24 w-24 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    {/* Title */}
                    <Text
                        variant="cardTitle"
                        className="truncate transition-colors group-hover:text-primary"
                    >
                        {title}
                    </Text>

                    {/* Meta line */}
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                        {formattedDate && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formattedDate}
                            </span>
                        )}
                        {readingTime && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {readingTime}
                            </span>
                        )}
                        {tags && tags.length > 0 && (
                            <span className="flex flex-wrap gap-1.5">
                                {tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-[0.65rem]">
                                        {tag}
                                    </Badge>
                                ))}
                            </span>
                        )}
                        {techStack && techStack.length > 0 && (
                            <span className="flex flex-wrap gap-1.5">
                                {techStack.map((tech) => (
                                    <Badge key={tech} variant="outline" className="font-mono text-[0.65rem]">
                                        {tech}
                                    </Badge>
                                ))}
                            </span>
                        )}
                    </div>

                    {/* Excerpt */}
                    {description && (
                        <Text variant="bodySmall" className="line-clamp-2 leading-relaxed">
                            {description}
                        </Text>
                    )}
                </div>
            </Link>

            {/* Project external links — rendered outside the main Link to avoid nested <a> */}
            {type === 'project' && (githubUrl || projectUrl) && (
                <div className="flex gap-2 pb-3 pl-0 sm:pl-[calc(6rem+1.25rem)]">
                    {githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                            >
                                <Github className="h-3.5 w-3.5" />
                                {common.code}
                            </a>
                        </Button>
                    )}
                    {projectUrl && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {common.liveDemo}
                            </a>
                        </Button>
                    )}
                </div>
            )}
        </article>
    )
}

export default ListEntry
