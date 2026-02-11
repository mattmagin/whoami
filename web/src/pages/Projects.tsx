import { useProjects } from '@/hooks/queries'
import { Text, Stack, Flex, Grid, Container, Skeleton } from '@/components/ui'
import ContentCard from '@/components/ContentCard'
import ErrorState from '@/components/ErrorState'
import { AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import { useContent } from '@/providers/ContentProvider'
import { isApiError } from '@/api'

const Projects = () => {
  const { projects: projectsStrings } = useContent()
  const { data: projects, isLoading, error, refetch } = useProjects()

  if (isLoading) {
    return (
      <Container size="lg" padding="lg">
        <Skeleton className="mb-4 h-10 w-1/2" />
        <Stack gap="xs" className="mb-12">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </Stack>
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
          {Array.from({ length: 6 }, (_, i) => (
            <Stack key={i} gap="md" className="rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Flex gap="xs">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </Flex>
            </Stack>
          ))}
        </Grid>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="lg" padding="lg">
        <ErrorState
          statusCode={isApiError(error) ? error.status : undefined}
          detail={isApiError(error) ? error.detail : undefined}
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
                  <ContentCard type="project" item={project} />
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
                  <ContentCard type="project" item={project} />
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
