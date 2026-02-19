import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Text } from '@/components/ui'
import type { Post, Project } from '@/api'

type ListEntryProps =
    | { type: 'post'; item: Post }
    | { type: 'project'; item: Project }

const ListEntry = (props: ListEntryProps) => {
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
                    </div>

                    {/* Excerpt */}
                    {description && (
                        <Text variant="bodySmall" className="line-clamp-2 leading-relaxed">
                            {description}
                        </Text>
                    )}
                </div>
            </Link>
        </article>
    )
}

export default ListEntry
