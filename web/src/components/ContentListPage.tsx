import type { UseQueryResult } from '@tanstack/react-query'
import { Text, Stack, Flex, Skeleton } from '@/components/ui'
import ListEntry from '@/components/ListEntry'
import ErrorState from '@/components/ErrorState'
import { AnimatedListItem } from '@/components/AnimatedSection'
import { isApiError } from '@/api'
import type { PaginatedResponse, Post, Project } from '@/api'
import { useDeferredLoading } from '@/hooks'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

type ContentItem = Post | Project

interface ContentListPageProps<T extends ContentItem> {
    /** Empty state message */
    emptyState: string
    /** TanStack Query result for the current page */
    query: UseQueryResult<PaginatedResponse<T>, Error>
    /** Props to spread onto each ListEntry (type + item) */
    getEntryProps: (item: T) => { type: 'post'; item: Post } | { type: 'project'; item: Project }
    /** Current page number (1-based) */
    page: number
    /** Callback when the user navigates to a different page */
    onPageChange: (page: number) => void
}

/** Build the array of page numbers / ellipsis markers to render. */
const buildPageNumbers = (current: number, total: number): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1]

    if (current > 3) {
        pages.push('ellipsis-start')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    if (current < total - 2) {
        pages.push('ellipsis-end')
    }

    pages.push(total)
    return pages
}

const ContentListPage = <T extends ContentItem>({
    emptyState,
    query,
    getEntryProps,
    page,
    onPageChange,
}: ContentListPageProps<T>) => {
    const { data, isLoading, error, refetch } = query
    const showLoading = useDeferredLoading(isLoading)

    const items = data?.data ?? []
    const meta = data?.meta
    const totalPages = meta?.totalPages ?? 1
    const count = items.length

    if (showLoading) {
        return (
            <Stack gap="sm">
                {Array.from({ length: 4 }, (_, i) => (
                    <Flex key={i} gap="md" className="rounded-lg border-l-2 border-l-transparent py-4 pl-4">
                        <Skeleton className="hidden h-24 w-24 shrink-0 rounded-md sm:block" />
                        <Stack gap="xs" className="flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </Stack>
                    </Flex>
                ))}
            </Stack>
        )
    }

    // Deferred period: loading but skeleton not yet visible — render nothing
    // (the page slide-up animation masks this brief empty frame)
    if (isLoading) return null

    if (error) {
        return (
            <ErrorState
                statusCode={isApiError(error) ? error.status : undefined}
                detail={isApiError(error) ? error.detail : undefined}
                onRetry={() => refetch()}
            />
        )
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <AnimatedListItem key={item.slug}>
                        <ListEntry
                            {...getEntryProps(item)}
                        />
                    </AnimatedListItem>
                ))}
            </div>

            {/* Empty State */}
            {count === 0 && (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                    <Text variant="muted">{emptyState}</Text>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                disabled={page <= 1}
                                onClick={() => onPageChange(page - 1)}
                            />
                        </PaginationItem>

                        {buildPageNumbers(page, totalPages).map((entry) => {
                            if (entry === 'ellipsis-start' || entry === 'ellipsis-end') {
                                return (
                                    <PaginationItem key={entry}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )
                            }
                            return (
                                <PaginationItem key={entry}>
                                    <PaginationLink
                                        isActive={entry === page}
                                        onClick={() => onPageChange(entry)}
                                    >
                                        {entry}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        })}

                        <PaginationItem>
                            <PaginationNext
                                disabled={page >= totalPages}
                                onClick={() => onPageChange(page + 1)}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    )
}

export default ContentListPage
