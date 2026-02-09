import { useProjects } from '@/hooks/queries'
import { Text, Stack, Grid, Container } from '@/components/ui'
import ProjectCard from '@/components/ProjectCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ErrorState from '@/components/ErrorState'
import { AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import { useContent } from '@/providers/ContentProvider'

const Projects = () => {
  const { projects: projectsStrings } = useContent()
  const { data: projects, isLoading, error, refetch } = useProjects()

  if (isLoading) {
    return (
      <Container size="lg" padding="lg">
        <LoadingSkeleton variant="title" className="mb-4" />
        <LoadingSkeleton variant="text" className="mb-12" />
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
          <LoadingSkeleton variant="card" count={6} />
        </Grid>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="lg" padding="lg">
        <ErrorState
          title="Failed to load projects"
          message="We couldn't load the projects. Please try again."
          onRetry={() => refetch()}
        />
      </Container>
    )
  }

  // Sort: featured first, then alphabetically
  const sortedProjects = [...(projects ?? [])].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return (a.name ?? '').localeCompare(b.name ?? '')
  })

  const featuredProjects = sortedProjects.filter((p) => p.featured)
  const otherProjects = sortedProjects.filter((p) => !p.featured)

  return (
    <Container size="lg" padding="lg">
      {/* Header */}
      <AnimatedSection>
        <Stack as="header" gap="sm" className="mb-12">
          <Text variant="pageTitle">
            {projectsStrings.title}
          </Text>
          <Text variant="body">
            {projectsStrings.description}
          </Text>
        </Stack>
      </AnimatedSection>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <AnimatedSection delay={0.1}>
          <Stack as="section" gap="lg" className="mb-12">
            <Text variant="label" as="h2" className="uppercase tracking-wider">
              {projectsStrings.featuredSection}
            </Text>
            <AnimatedList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <AnimatedListItem key={project.slug}>
                  <ProjectCard project={project} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </Stack>
        </AnimatedSection>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <AnimatedSection delay={0.2}>
          <Stack as="section" gap="lg">
            <Text variant="label" as="h2" className="uppercase tracking-wider">
              {projectsStrings.otherSection}
            </Text>
            <AnimatedList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project) => (
                <AnimatedListItem key={project.slug}>
                  <ProjectCard project={project} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </Stack>
        </AnimatedSection>
      )}

      {/* Empty State */}
      {(projects ?? []).length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Text variant="muted">{projectsStrings.emptyState}</Text>
        </div>
      )}
    </Container>
  )
}

export default Projects
