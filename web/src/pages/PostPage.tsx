import { useParams } from 'react-router-dom'
import { Clock, ExternalLink, Github } from 'lucide-react'
import { Badge, Button, Flex, ScrollArea } from '@/components/ui'
import Post from '@/components/Post'
import { usePost, useProject } from '@/hooks/queries'
import { useContent } from '@/providers/ContentProvider'
import usePostType from '@/hooks/usePostType'

const PostPage = () => {
    const { slug } = useParams<{ slug: string }>()
    const type = usePostType()
    const { common, blogPost: blogStrings, projectPost: projectStrings } = useContent()!

    const postQuery = usePost(type === 'blog' ? (slug ?? '') : '')
    const projectQuery = useProject(type === 'project' ? (slug ?? '') : '')

    const { data, isLoading, error, refetch } = type === 'blog' ? postQuery : projectQuery

    // Map type-specific fields to unified props
    const post = type === 'blog' ? postQuery.data : undefined
    const project = type === 'project' ? projectQuery.data : undefined

    const title = type === 'blog' ? (post?.title ?? null) : (project?.name ?? null)
    const publishedAt = data?.publishedAt ?? null
    const markdownContent = type === 'blog' ? (post?.content ?? null) : (project?.description ?? null)
    const featureImageUrl = type === 'blog' ? post?.featureImageUrl : project?.imageUrl

    const backTo = type === 'blog' ? '/blog' : '/projects'
    const backLabel = type === 'blog' ? common.backToBlog : common.backToProjects
    const footerText = type === 'blog' ? blogStrings.thanksForReading : projectStrings.interestedInProject

    // Blog badges: tags
    // Project badges: featured + tech stack
    const badges = type === 'blog'
        ? (post?.tags ?? []).length > 0 ? (
            <Flex gap="sm" wrap>
                {post!.tags!.map((tag) => (
                    <Badge key={tag} variant="secondary">
                        {tag}
                    </Badge>
                ))}
            </Flex>
        ) : undefined
        : (project?.featured || (project?.techStack ?? []).length > 0) ? (
            <Flex gap="sm" wrap>
                {project!.featured && (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        {common.featured}
                    </Badge>
                )}
                {(project!.techStack ?? []).map((tech) => (
                    <Badge key={tech} variant="secondary">
                        {tech}
                    </Badge>
                ))}
            </Flex>
        ) : undefined

    // Blog meta: reading time
    const meta = type === 'blog' && post?.readingTime ? (
        <Flex align="center" gap="xs">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime}</span>
        </Flex>
    ) : undefined

    // Project header extras: GitHub + Live Demo links
    const headerExtras = type === 'project' && (project?.githubUrl || project?.url) ? (
        <Flex gap="sm" wrap>
            {project!.githubUrl && (
                <Button variant="outline" size="sm" asChild>
                    <a
                        href={project!.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                    >
                        <Github className="h-4 w-4" />
                        {common.code}
                    </a>
                </Button>
            )}
            {project!.url && (
                <Button variant="outline" size="sm" asChild>
                    <a
                        href={project!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                    >
                        <ExternalLink className="h-4 w-4" />
                        {common.liveDemo}
                    </a>
                </Button>
            )}
        </Flex>
    ) : undefined

    return (
        <ScrollArea className="h-full">
            <Post
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                backTo={backTo}
                backLabel={backLabel}
                title={title}
                publishedAt={publishedAt}
                markdownContent={markdownContent}
                featureImageUrl={featureImageUrl}
                badges={badges}
                meta={meta}
                headerExtras={headerExtras}
                footerText={footerText}
            />
        </ScrollArea>
    )
}

export default PostPage
