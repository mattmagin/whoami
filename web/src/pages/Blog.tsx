import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePosts } from '@/hooks/queries'
import ContentListPage from '@/components/ContentListPage'
import PageHeader from '@/components/PageHeader'
import type { Post } from '@/api'

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const query = usePosts(page)

  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams(newPage > 1 ? { page: String(newPage) } : {})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setSearchParams])

  return (
    <>
      <PageHeader title="Blog" description="Thoughts on development, tools, and the craft of building software." />
      <ContentListPage<Post>
        emptyState="No posts yet. Check back soon!"
        query={query}
        getEntryProps={(post) => ({ type: 'post', item: post })}
        page={page}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default Blog
