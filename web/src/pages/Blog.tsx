import { usePosts } from '@/hooks/queries'
import PostCard from '@/components/PostCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ErrorState from '@/components/ErrorState'
import { AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import { useStrings } from '@/content'

const Blog = () => {
  const { blog } = useStrings()
  const { data: posts, isLoading, error, refetch } = usePosts()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <LoadingSkeleton variant="title" className="mb-4" />
        <LoadingSkeleton variant="text" className="mb-12" />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <ErrorState
          title="Failed to load posts"
          message="We couldn't load the blog posts. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const sortedPosts = [...(posts ?? [])].sort(
    (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
  )

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <AnimatedSection>
        <header className="mb-12">
          <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight">
            {blog.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {blog.description}
          </p>
        </header>
      </AnimatedSection>

      {/* Posts List */}
      <AnimatedList className="space-y-6">
        {sortedPosts.map((post) => (
          <AnimatedListItem key={post.slug}>
            <PostCard post={post} />
          </AnimatedListItem>
        ))}
      </AnimatedList>

      {/* Empty State */}
      {sortedPosts.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">{blog.emptyState}</p>
        </div>
      )}
    </div>
  )
}

export default Blog
