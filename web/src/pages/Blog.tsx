import { usePosts } from '@/hooks/queries'
import { Text, Stack, Flex, Grid, Container, Skeleton } from '@/components/ui'
import ContentCard from '@/components/ContentCard'
import ErrorState from '@/components/ErrorState'
import { AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import { useContent } from '@/providers/ContentProvider'
import { isApiError } from '@/api'

const Blog = () => {
  const { blog } = useContent()
  const { data: posts, isLoading, error, refetch } = usePosts()

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
          {Array.from({ length: 3 }, (_, i) => (
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

  const sortedPosts = [...(posts ?? [])].sort(
    (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
  )

  return (
    <Container size="lg" padding="lg">
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
      <AnimatedList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedPosts.map((post) => (
          <AnimatedListItem key={post.slug}>
            <ContentCard type="post" item={post} />
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
