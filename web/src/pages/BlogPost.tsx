import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import ReadingProgress from '@/components/ReadingProgress'
import { getPost } from '@/data'
import { useStrings } from '@/content'

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined
  const { common, blogPost } = useStrings()

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight">
          {blogPost.notFoundTitle}
        </h1>
        <p className="mb-8 text-muted-foreground">
          {blogPost.notFoundDescription}
        </p>
        <Button asChild>
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {common.backToBlog}
          </Link>
        </Button>
      </div>
    )
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Simple markdown-to-HTML conversion for demo purposes
  // In production, you'd use a proper markdown parser like react-markdown
  const renderContent = (content: string) => {
    return content
      .split('\n\n')
      .map((block, i) => {
        // Headers
        if (block.startsWith('# ')) {
          return (
            <h1 key={i} className="mb-6 mt-10 font-serif text-3xl font-bold tracking-tight first:mt-0">
              {block.slice(2)}
            </h1>
          )
        }
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="mb-4 mt-8 font-serif text-2xl font-semibold tracking-tight">
              {block.slice(3)}
            </h2>
          )
        }
        if (block.startsWith('### ')) {
          return (
            <h3 key={i} className="mb-3 mt-6 font-serif text-xl font-semibold tracking-tight">
              {block.slice(4)}
            </h3>
          )
        }

        // Code blocks
        if (block.startsWith('```')) {
          const lines = block.split('\n')
          const code = lines.slice(1, -1).join('\n')
          return (
            <pre
              key={i}
              className="my-6 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm"
            >
              <code>{code}</code>
            </pre>
          )
        }

        // Lists
        if (block.startsWith('- ')) {
          const items = block.split('\n').filter((line) => line.startsWith('- '))
          return (
            <ul key={i} className="my-4 ml-6 list-disc space-y-2">
              {items.map((item, j) => (
                <li key={j} className="text-muted-foreground">
                  {item.slice(2)}
                </li>
              ))}
            </ul>
          )
        }

        // Numbered lists
        if (/^\d+\. /.test(block)) {
          const items = block.split('\n').filter((line) => /^\d+\. /.test(line))
          return (
            <ol key={i} className="my-4 ml-6 list-decimal space-y-2">
              {items.map((item, j) => (
                <li key={j} className="text-muted-foreground">
                  {item.replace(/^\d+\. /, '')}
                </li>
              ))}
            </ol>
          )
        }

        // Regular paragraphs
        // Handle inline code and bold
        const processedBlock = block
          .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

        return (
          <p
            key={i}
            className="my-4 leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: processedBlock }}
          />
        )
      })
  }

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Back Link */}
        <Button variant="ghost" asChild className="mb-8 -ml-4">
        <Link to="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {common.backToBlog}
        </Link>
      </Button>

      {/* Article Header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight md:text-5xl">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime}
          </span>
        </div>
      </header>

      <Separator className="mb-10" />

      {/* Article Content */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        {renderContent(post.content)}
      </article>

      <Separator className="my-12" />

      {/* Footer */}
      <footer className="text-center">
        <p className="mb-4 text-muted-foreground">
          {blogPost.thanksForReading}
        </p>
        <Button asChild>
          <Link to="/contact">{common.getInTouch}</Link>
        </Button>
      </footer>
      </div>
    </>
  )
}

export default BlogPost
