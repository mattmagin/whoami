import { useParams } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { Badge, Flex, ScrollArea } from '@/components/ui'
import Post from '@/components/Post'
import { usePost } from '@/hooks/queries'
import { useContent } from '@/providers/ContentProvider'

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, error, refetch } = usePost(slug ?? '')
  const { common, blogPost } = useContent()!

  return (
    <ScrollArea className="h-full">
      <Post
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        backTo="/blog"
        backLabel={common.backToBlog}
        title={post?.title ?? null}
        publishedAt={post?.publishedAt ?? null}
        markdownContent={post?.content ?? null}
        featureImageUrl={post?.featureImageUrl}
        badges={
          (post?.tags ?? []).length > 0 ? (
            <Flex gap="sm" wrap>
              {post!.tags!.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </Flex>
          ) : undefined
        }
        meta={
          post?.readingTime ? (
            <Flex align="center" gap="xs">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}</span>
            </Flex>
          ) : undefined
        }
        footerText={blogPost.thanksForReading}
      />
    </ScrollArea>
  )
}

export default BlogPost
