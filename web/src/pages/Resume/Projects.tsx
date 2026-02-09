import { Badge, Text, Stack, Flex } from '@/components/ui'
import type { ResumeProject } from '@/types'

interface ProjectsProps {
    projects: ResumeProject[]
}

const Projects = ({ projects = [] }: ProjectsProps) => {
    if (projects.length === 0) {
        return null
    }

    return (
        <Stack as="section" gap="lg">
            <Text variant="sectionTitle">
                Projects
            </Text>
            <Stack gap="lg">
                {projects.map((project) => (
                    <Stack key={project.name} gap="sm">
                        <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary/50">
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                        </div>
                        <Text variant="bodySmall" className="pl-6">
                            {project.description}
                        </Text>
                        <Flex gap="xs" wrap className="pl-6">
                            {project.technologies.map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                    {tech}
                                </Badge>
                            ))}
                        </Flex>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    )
}

export default Projects
