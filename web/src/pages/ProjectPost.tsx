import { useParams } from 'react-router-dom'
import { ExternalLink, Github } from 'lucide-react'
import { Badge, Button, Flex, ScrollArea } from '@/components/ui'
import Post from '@/components/Post'
import { useProject } from '@/hooks/queries'
import { useContent } from '@/providers/ContentProvider'

const ProjectPost = () => {
    const { slug } = useParams<{ slug: string }>()
    const { data: project, isLoading, error, refetch } = useProject(slug ?? '')
    const { common, projectPost } = useContent()!

    return (
        <ScrollArea className="h-full">
            <Post
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                backTo="/projects"
                backLabel={common.backToProjects}
                title={project?.name ?? null}
                publishedAt={project?.publishedAt ?? null}
                markdownContent={project?.description ?? null}
                featureImageUrl={project?.imageUrl}
                badges={
                    (project?.featured || (project?.techStack ?? []).length > 0) ? (
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
                }
                headerExtras={
                    (project?.githubUrl || project?.url) ? (
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
                }
                footerText={projectPost.interestedInProject}
            />
        </ScrollArea>
    )
}

export default ProjectPost
