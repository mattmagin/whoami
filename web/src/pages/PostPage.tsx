import { useParams } from 'react-router-dom'
import { ExternalLink, Github } from 'lucide-react'
import { Badge, Button, Flex } from '@/components/ui'
import Post from '@/components/Post'
import { useProject } from '@/hooks/queries'

const PostPage = () => {
    const { slug } = useParams<{ slug: string }>()
    const { data: project, isLoading, error, refetch } = useProject(slug ?? '')

    const title = project?.name ?? null
    const publishedAt = project?.publishedAt ?? null
    const markdownContent = project?.description ?? null
    const featureImageUrl = project?.imageUrl

    const badges = (project?.featured || (project?.techStack ?? []).length > 0) ? (
        <Flex gap="sm" wrap>
            {project!.featured && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    Featured
                </Badge>
            )}
            {(project!.techStack ?? []).map((tech) => (
                <Badge key={tech} variant="secondary">
                    {tech}
                </Badge>
            ))}
        </Flex>
    ) : undefined

    const headerExtras = (project?.githubUrl || project?.url) ? (
        <Flex gap="sm" wrap>
            {project!.githubUrl && (
                <Button variant="ghost" size="sm" asChild>
                    <a
                        href={project!.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                    >
                        <Github className="h-4 w-4" />
                        Code
                    </a>
                </Button>
            )}
            {project!.url && (
                <Button variant="ghost" size="sm" asChild>
                    <a
                        href={project!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                    </a>
                </Button>
            )}
        </Flex>
    ) : undefined

    return (
        <Post
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            title={title}
            publishedAt={publishedAt}
            markdownContent={markdownContent}
            featureImageUrl={featureImageUrl}
            badges={badges}
            headerExtras={headerExtras}
        />
    )
}

export default PostPage
