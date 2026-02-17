import type { UseQueryResult } from '@tanstack/react-query'
import { Text, Stack, Flex, Skeleton, ScrollArea } from '@/components/ui'
import ListEntry from '@/components/ListEntry'
import ErrorState from '@/components/ErrorState'
import { AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import { isApiError } from '@/api'
import type { Post, Project } from '@/types'

type ContentItem = Post | Project

interface ContentListPageProps<T extends ContentItem> {
    /** Empty state message */
    emptyState: string
    /** TanStack Query result for the list */
    query: UseQueryResult<T[], Error>
    /** Sort comparator for the items */
    sort: (a: T, b: T) => number
    /** Props to spread onto each ListEntry (type + item) */
    getEntryProps: (item: T) => { type: 'post'; item: Post } | { type: 'project'; item: Project }
}

const ContentListPage = <T extends ContentItem>({
    emptyState,
    query,
    sort,
    getEntryProps,
}: ContentListPageProps<T>) => {
    const { data, isLoading, error, refetch } = query

    const sorted = [...(data ?? [])].sort(sort)
    const count = sorted.length

    if (isLoading) {
        return (
            <>
                <Skeleton className="mb-4 h-10 w-1/2" />
                <Stack gap="xs" className="mb-12">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </Stack>
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
            </>
        )
    }

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
        <div className="flex h-full flex-col">
            {/* Scrollable list */}
            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <AnimatedList className="flex flex-col gap-2">
                        {sorted.map((item) => (
                            <AnimatedListItem key={item.slug}>
                                <ListEntry
                                    {...getEntryProps(item)}
                                />
                            </AnimatedListItem>
                        ))}
                    </AnimatedList>

                    {/* Empty State */}
                    {count === 0 && (
                        <div className="rounded-lg border border-dashed border-border p-12 text-center">
                            <Text variant="muted">{emptyState}</Text>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}

export default ContentListPage
