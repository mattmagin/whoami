import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProjects } from '@/hooks/queries'
import ContentListPage from '@/components/ContentListPage'
import PageHeader from '@/components/PageHeader'
import type { Project } from '@/api'

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const query = useProjects(page)

  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams(newPage > 1 ? { page: String(newPage) } : {})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setSearchParams])

  return (
    <>
      <PageHeader title="Projects" description="A collection of personal projects, open-source contributions, and experiments." />
      <ContentListPage<Project>
        emptyState="No projects yet. Check back soon!"
        query={query}
        getEntryProps={(project) => ({ type: 'project', item: project })}
        page={page}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default Projects
