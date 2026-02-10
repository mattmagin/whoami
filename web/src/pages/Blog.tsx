import { usePosts } from '@/hooks/queries'
import { Text, Stack, Container } from '@/components/ui'
import PostCard from '@/components/PostCard'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ErrorState from '@/components/ErrorState'
import { AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import { useContent } from '@/providers/ContentProvider'
import { isApiError } from '@/api'

const Blog = () => {
  const { blog } = useContent()
  const { data: posts, isLoading, error, refetch } = usePosts()

  if (isLoading) {
    return (
      <Container size="md" padding="lg">
        <LoadingSkeleton variant="title" className="mb-4" />
        <LoadingSkeleton variant="text" className="mb-12" />
        <LoadingSkeleton variant="card" count={3} />
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="md" padding="lg">
        <ErrorState
          statusCode={isApiError(error) ? error.status : undefined}
          detail={isApiError(error) ? error.detail : undefined}
          onRetry={() => refetch()}
        />
      </Container>
    )
  }

  const sortedPosts = [...(posts ?? [])].sort(
    (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
  )

  return (
    <Container size="md" padding="lg">
      {/* Header */}
      <AnimatedSection>
        <Stack as="header" gap="sm" className="mb-12">
          <Text variant="pageTitle">
            {blog.title}
          </Text>
          <Text variant="body">
            {blog.description}
          </Text>
        </Stack>
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
          <Text variant="muted">{blog.emptyState}</Text>
        </div>
      )}
    </Container>
  )
}

export default Blog
