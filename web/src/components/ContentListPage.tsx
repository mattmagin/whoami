import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UseQueryResult } from '@tanstack/react-query'
import { Text, Stack, Flex, Skeleton, ScrollArea } from '@/components/ui'
import ListEntry from '@/components/ListEntry'
import ErrorState from '@/components/ErrorState'
import { AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/AnimatedSection'
import useKeyBindings, { type KeyBinding } from '@/hooks/useKeyBindings'
import { isApiError } from '@/api'
import type { Post, Project } from '@/types'

type ContentItem = Post | Project

interface ContentListPageProps<T extends ContentItem> {
    /** Page title */
    title: string
    /** Page description */
    description: string
    /** Empty state message */
    emptyState: string
    /** TanStack Query result for the list */
    query: UseQueryResult<T[], Error>
    /** Sort comparator for the items */
    sort: (a: T, b: T) => number
    /** Derive the navigation path for a given item */
    getHref: (item: T) => string
    /** Props to spread onto each ListEntry (type + item) */
    getEntryProps: (item: T) => { type: 'post'; item: Post } | { type: 'project'; item: Project }
}

const ContentListPage = <T extends ContentItem>({
    title,
    description,
    emptyState,
    query,
    sort,
    getHref,
    getEntryProps,
}: ContentListPageProps<T>) => {
    const { data, isLoading, error, refetch } = query
    const navigate = useNavigate()
    const [activeIndex, setActiveIndex] = useState(-1)
    const itemRefs = useRef<(HTMLElement | null)[]>([])

    const sorted = [...(data ?? [])].sort(sort)
    const count = sorted.length

    const activateAndScroll = useCallback((index: number) => {
        setActiveIndex(index)
        itemRefs.current[index]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, [])

    const activateNext = () => {
        const next = activeIndex < 0 ? 0 : (activeIndex + 1) % count
        activateAndScroll(next)
    }
    const activatePrev = () => {
        const prev = activeIndex < 0 ? count - 1 : (activeIndex - 1 + count) % count
        activateAndScroll(prev)
    }
    const selectActive = () => {
        if (activeIndex >= 0 && activeIndex < count) {
            const item = sorted[activeIndex]
            if (item) navigate(getHref(item))
        }
    }

    const bindings: KeyBinding[] = count > 0
        ? [
            { keys: ['ArrowDown'], callback: activateNext, preventDefault: true },
            { keys: ['j'], callback: activateNext, preventDefault: true },
            { keys: ['ArrowUp'], callback: activatePrev, preventDefault: true },
            { keys: ['k'], callback: activatePrev, preventDefault: true },
            { keys: ['Enter'], callback: selectActive },
            { keys: ['ArrowRight'], callback: selectActive },
            { keys: ['l'], callback: selectActive },
        ]
        : []

    useKeyBindings(bindings)

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
            {/* Fixed header */}
            <div className="shrink-0 pb-6">
                <AnimatedSection>
                    <Stack as="header" gap="sm">
                        <Text variant="pageTitle">{title}</Text>
                        <Text variant="body">{description}</Text>
                    </Stack>
                </AnimatedSection>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <AnimatedList className="flex flex-col gap-2">
                        {sorted.map((item, index) => (
                            <AnimatedListItem key={item.slug}>
                                <ListEntry
                                    ref={(el) => { itemRefs.current[index] = el }}
                                    {...getEntryProps(item)}
                                    active={activeIndex === index}
                                    onActivate={() => setActiveIndex(index)}
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
