import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button, Badge, Separator, Text, Stack, Flex, Container } from '@/components/ui'
import ReadingProgress from '@/components/ReadingProgress'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ErrorState from '@/components/ErrorState'
import { usePost } from '@/hooks/queries'
import { useContent } from '@/providers/ContentProvider'

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, error, refetch } = usePost(slug ?? '')
  const { common, blogPost } = useContent()

  if (isLoading) {
    return (
      <Container size="sm" padding="lg">
        <LoadingSkeleton variant="title" className="mb-8" />
        <LoadingSkeleton variant="text" />
        <Stack gap="sm" className="mt-10">
          <LoadingSkeleton variant="text" />
          <LoadingSkeleton variant="text" />
          <LoadingSkeleton variant="text" />
        </Stack>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="sm" padding="lg">
        <ErrorState
          title="Failed to load post"
          message="We couldn't load this blog post. Please try again."
          onRetry={() => refetch()}
        />
      </Container>
    )
  }

  if (!post) {
    return (
      <Container size="md" padding="lg" className="text-center">
        <Text variant="pageTitle" className="mb-4">
          {blogPost.notFoundTitle}
        </Text>
        <Text variant="muted" as="p" className="mb-8">
          {blogPost.notFoundDescription}
        </Text>
        <Button asChild>
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {common.backToBlog}
          </Link>
        </Button>
      </Container>
    )
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null

  return (
    <>
      <ReadingProgress />
      <Container size="sm" padding="lg">
        {/* Back Link */}
        <Button variant="ghost" asChild className="mb-8 -ml-4">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {common.backToBlog}
          </Link>
        </Button>

        {/* Article Header */}
        <Stack as="header" gap="md" className="mb-10">
          <Flex gap="sm" wrap>
            {(post.tags ?? []).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </Flex>

          <Text variant="pageTitle">
            {post.title}
          </Text>

          <Flex align="center" gap="md" className="text-sm text-muted-foreground">
            {formattedDate && (
              <Flex align="center" gap="xs">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </Flex>
            )}
            <Flex align="center" gap="xs">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}</span>
            </Flex>
          </Flex>
        </Stack>

        <Separator className="mb-10" />

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {post.content && (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          )}
        </article>

        <Separator className="my-12" />

        {/* Footer */}
        <Stack as="footer" gap="md" align="center">
          <Text variant="muted">
            {blogPost.thanksForReading}
          </Text>
          <Button asChild>
            <Link to="/contact">{common.getInTouch}</Link>
          </Button>
        </Stack>
      </Container>
    </>
  )
}

export default BlogPost
