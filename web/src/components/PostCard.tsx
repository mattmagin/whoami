import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { Badge, Text } from '@/components/ui'
import type { Post } from '@/types'
import { useContent } from '@/providers/ContentProvider'

interface PostCardProps {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const { common } = useContent()

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null

  return (
    <article className="group">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="overflow-hidden rounded-lg border border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-sm">
          {/* Feature Image */}
          {post.featureImageUrl && (
            <div className="aspect-video overflow-hidden">
              <img
                src={post.featureImageUrl}
                alt={post.title ?? ''}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}

          <div className="p-6">
          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-2">
            {(post.tags ?? []).slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <Text variant="cardTitle" className="mb-2 transition-colors group-hover:text-primary">
            {post.title}
          </Text>

          {/* Excerpt */}
          <Text variant="bodySmall" className="mb-4 leading-relaxed">
            {post.excerpt}
          </Text>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime}
              </span>
            </div>
            <span className="flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
              {common.readMore}
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default PostCard
