import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Separator, Text, Stack, Flex, Container, Skeleton } from '@/components/ui'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import ErrorState from '@/components/ErrorState'
import { useDeferredLoading } from '@/hooks'
import useKeyBindings from '@/hooks/useKeyBindings'
import { isApiError } from '@/api'
import { ERROR_TYPE, ERROR_DEFINITIONS } from '@/consts'

interface PostProps {
    /** Query state */
    isLoading: boolean
    error: Error | null
    refetch: () => void

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

}

const Post = ({
    isLoading,
    error,
    refetch,
    title,
    publishedAt,
    markdownContent,
    featureImageUrl,
    badges,
    meta,
    headerExtras,
}: PostProps) => {
    const navigate = useNavigate()
    const showLoading = useDeferredLoading(isLoading)

    useKeyBindings([
        {
            keys: ['Backspace'],
            callback: () => navigate(-1),
        },
    ])

    if (showLoading) {
        return (
            <Container size="sm" padding="lg">
                <Skeleton className="mb-8 h-10 w-1/2" />
                <Stack gap="xs">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </Stack>
                <Stack gap="sm" className="mt-10">
                    <Stack gap="xs">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </Stack>
                    <Stack gap="xs">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </Stack>
                    <Stack gap="xs">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </Stack>
                </Stack>
            </Container>
        )
    }

    // Deferred period: loading but skeleton not yet visible — render nothing
    // (the page slide-up animation masks this brief empty frame)
    if (isLoading) return null

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
                <Text variant="muted" as="p">
                    {notFound.message}
                </Text>
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
        <Container size="sm" padding="none">
            {/* Header */}
            <Stack as="header" gap="md" className="mb-10">
                <Text variant="pageTitle">
                    {title}
                </Text>

                {badges}

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
                <AspectRatio ratio={16 / 9} className="mb-10 overflow-hidden rounded-lg">
                    <img
                        src={featureImageUrl}
                        alt={title ?? ''}
                        className="h-full w-full object-cover"
                    />
                </AspectRatio>
            )}

            {/* Content */}
            <article className="prose lg:prose-lg dark:prose-invert max-w-none">
                {markdownContent && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdownContent}
                    </ReactMarkdown>
                )}
            </article>
        </Container>
    )
}

export default Post
