import { useProjects } from '@/hooks/queries'
import ContentListPage from '@/components/ContentListPage'
import { useContent } from '@/providers/ContentProvider'
import type { Project } from '@/types'

const Projects = () => {
  const { projects: projectsStrings } = useContent()!
  const query = useProjects()

  return (
    <ContentListPage<Project>
      title={projectsStrings.title}
      description={projectsStrings.description}
      emptyState={projectsStrings.emptyState}
      query={query}
      sort={(a, b) => (a.name ?? '').localeCompare(b.name ?? '')}
      getHref={(project) => `/projects/${project.slug}`}
      getEntryProps={(project) => ({ type: 'project', item: project })}
    />
  )
}

export default Projects
