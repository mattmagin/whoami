import { usePosts } from '@/hooks/queries'
import ContentListPage from '@/components/ContentListPage'
import { useContent } from '@/providers/ContentProvider'
import type { Post } from '@/types'

const Blog = () => {
  const { blog } = useContent()!
  const query = usePosts()

  return (
    <ContentListPage<Post>
      emptyState={blog.emptyState}
      query={query}
      sort={(a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()}
      getEntryProps={(post) => ({ type: 'post', item: post })}
    />
  )
}

export default Blog
