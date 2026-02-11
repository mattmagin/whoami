import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button, Separator, Text, Stack, Flex, Container } from '@/components/ui'
import ReadingProgress from '@/components/ReadingProgress'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ErrorState from '@/components/ErrorState'
import { useContent } from '@/providers/ContentProvider'
import { isApiError } from '@/api'
import { ERROR_TYPE, ERROR_DEFINITIONS } from '@/consts'

interface PostProps {
    /** Query state */
    isLoading: boolean
    error: Error | null
    refetch: () => void

    /** Back navigation */
    backTo: string
    backLabel: string

    /** Content (null = not found) */
    title: string | null
    publishedAt: string | null
    markdownContent: string | null

    /** Optional feature image displayed between header and content */
    featureImageUrl?: string | null

    /** Optional header sections passed as render slots */
    badges?: ReactNode
    meta?: ReactNode
    headerExtras?: ReactNode

    /** Footer */
    footerText: string
}

const Post = ({
    isLoading,
    error,
    refetch,
    backTo,
    backLabel,
    title,
    publishedAt,
    markdownContent,
    featureImageUrl,
    badges,
    meta,
    headerExtras,
    footerText,
}: PostProps) => {
    const { common } = useContent()

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
                    statusCode={isApiError(error) ? error.status : undefined}
                    detail={isApiError(error) ? error.detail : undefined}
                    onRetry={() => refetch()}
                />
            </Container>
        )
    }

    if (!title) {
        const notFound = ERROR_DEFINITIONS[ERROR_TYPE.NOT_FOUND]
        return (
            <Container size="md" padding="lg" className="text-center">
                <Text variant="pageTitle" className="mb-4">
                    {notFound.title}
                </Text>
                <Text variant="muted" as="p" className="mb-8">
                    {notFound.message}
                </Text>
                <Button asChild>
                    <Link to={backTo}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {backLabel}
                    </Link>
                </Button>
            </Container>
        )
    }

    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-US', {
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
                    <Link to={backTo}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {backLabel}
                    </Link>
                </Button>

                {/* Header */}
                <Stack as="header" gap="md" className="mb-10">
                    {badges}

                    <Text variant="pageTitle">
                        {title}
                    </Text>

                    <Flex align="center" gap="md" className="text-sm text-muted-foreground">
                        {formattedDate && (
                            <Flex align="center" gap="xs">
                                <Calendar className="h-4 w-4" />
                                <span>{formattedDate}</span>
                            </Flex>
                        )}
                        {meta}
                    </Flex>

                    {headerExtras}
                </Stack>

                <Separator className="mb-10" />

                {/* Feature Image */}
                {featureImageUrl && (
                    <div className="mb-10 overflow-hidden rounded-lg">
                        <img
                            src={featureImageUrl}
                            alt={title ?? ''}
                            className="h-auto w-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <article className="prose prose-lg dark:prose-invert max-w-none">
                    {markdownContent && (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {markdownContent}
                        </ReactMarkdown>
                    )}
                </article>

                <Separator className="my-12" />

                {/* Footer */}
                <Stack as="footer" gap="md" align="center">
                    <Text variant="muted">
                        {footerText}
                    </Text>
                    <Button asChild>
                        <Link to="/contact">{common.getInTouch}</Link>
                    </Button>
                </Stack>
            </Container>
        </>
    )
}

export default Post
