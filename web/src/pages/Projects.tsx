import { projects } from '@/data'
import { ProjectCard } from '@/components/ProjectCard'
import { AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import { useStrings } from '@/content'

export function Projects() {
  const { projects: projectsStrings } = useStrings()

  // Sort: featured first, then alphabetically
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return a.name.localeCompare(b.name)
  })

  const featuredProjects = sortedProjects.filter((p) => p.featured)
  const otherProjects = sortedProjects.filter((p) => !p.featured)

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <AnimatedSection>
        <header className="mb-12">
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight">
            {projectsStrings.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {projectsStrings.description}
          </p>
        </header>
      </AnimatedSection>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <AnimatedSection delay={0.1}>
          <section className="mb-12">
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {projectsStrings.featuredSection}
            </h2>
            <AnimatedList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <AnimatedListItem key={project.slug}>
                  <ProjectCard project={project} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </section>
        </AnimatedSection>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <AnimatedSection delay={0.2}>
          <section>
            <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {projectsStrings.otherSection}
            </h2>
            <AnimatedList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project) => (
                <AnimatedListItem key={project.slug}>
                  <ProjectCard project={project} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </section>
        </AnimatedSection>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">{projectsStrings.emptyState}</p>
        </div>
      )}
    </div>
  )
}
