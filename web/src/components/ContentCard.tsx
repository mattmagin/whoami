import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock, ExternalLink, Github } from 'lucide-react'
import Tilt from 'react-parallax-tilt'
import { cn } from '@/lib/utils'
import { Badge, Button, Text } from '@/components/ui'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import type { Post, Project } from '@/types'
import { useContent } from '@/providers/ContentProvider'

type ContentCardProps =
    | { type: 'post'; item: Post }
    | { type: 'project'; item: Project }

const ContentCard = (props: ContentCardProps) => {
    const { common } = useContent()
    const { type, item } = props

    const href = type === 'post' ? `/blog/${item.slug}` : `/projects/${item.slug}`
    const title = type === 'post' ? item.title : item.name
    const description = item.excerpt

    const formattedDate =
        type === 'post' && item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            : null

    const imageUrl = type === 'post' ? item.featureImageUrl : item.imageUrl
    const tags = type === 'post' ? item.tags : null
    const readingTime = type === 'post' ? item.readingTime : null

    const featured = type === 'project' ? item.featured : false
    const techStack = type === 'project' ? item.techStack : null
    const githubUrl = type === 'project' ? item.githubUrl : null
    const projectUrl = type === 'project' ? item.url : null

    const card = (
        <Card className={cn(
            "group border-border/50 transition-all hover:border-primary/30",
            type === 'post' && "gap-4 overflow-hidden",
            imageUrl && "overflow-hidden pt-0",
            type === 'project' && "h-full",
        )}>
            {/* Feature Image */}
            {imageUrl && (
                <AspectRatio ratio={16 / 9} className="overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={title ?? ''}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </AspectRatio>
            )}

            <CardHeader>
                {/* Tags (posts) */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Featured badge (projects) */}
                {featured && (
                    <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
                        {common.featured}
                    </Badge>
                )}

                {/* Title */}
                <Text
                    variant="cardTitle"
                    className={cn(type === 'post' && "transition-colors group-hover:text-primary")}
                >
                    {title}
                </Text>
            </CardHeader>

            {/* Description */}
            <CardContent className={cn(type === 'project' && "flex-1 space-y-4")}>
                <Text variant="bodySmall" className="leading-relaxed">
                    {description}
                </Text>

                {/* Tech Stack (projects) */}
                {techStack && techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs font-mono">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Footer */}
            {type === 'post' ? (
                <CardFooter className="justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
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
                    </div>
                    <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        {common.readMore}
                        <ArrowRight className="h-3 w-3" />
                    </span>
                </CardFooter>
            ) : (
                <CardFooter className="gap-2" onClick={(e) => e.preventDefault()}>
                    {githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                            >
                                <Github className="h-4 w-4" />
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
                                <ExternalLink className="h-4 w-4" />
                                {common.liveDemo}
                            </a>
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    )

    const linkedCard = (
        <Link to={href} className={cn("block", type === 'project' && "h-full no-underline")}>
            {card}
        </Link>
    )

    if (type === 'project') {
        return (
            <Tilt
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                glareEnable={true}
                glareMaxOpacity={0.1}
                glareColor="#4a7c59"
                glarePosition="all"
                glareBorderRadius="0.5rem"
                transitionSpeed={300}
                gyroscope={false}
                className="h-full"
            >
                {linkedCard}
            </Tilt>
        )
    }

    return <article>{linkedCard}</article>
}

export default ContentCard
