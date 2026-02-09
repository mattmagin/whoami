import { cn } from '@/lib/utils'
import { Stack, Flex, Grid } from '@/components/ui'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'card' | 'text' | 'title' | 'page'
  count?: number
}

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-muted',
      className
    )}
  />
)

const CardSkeleton = () => (
  <Stack gap="md" className="rounded-lg border border-border p-6">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Flex gap="xs">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-16" />
    </Flex>
  </Stack>
)

const TextSkeleton = () => (
  <Stack gap="xs">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-4/6" />
  </Stack>
)

const TitleSkeleton = () => (
  <Skeleton className="h-10 w-1/2" />
)

const LoadingSkeleton = ({
  className,
  variant = 'card',
  count = 1,
}: LoadingSkeletonProps) => {
  const items = Array.from({ length: count }, (_, i) => i)

  if (variant === 'page') {
    return (
      <Stack gap="xl" className={className}>
        <TitleSkeleton />
        <TextSkeleton />
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
          {items.map((i) => (
            <CardSkeleton key={i} />
          ))}
        </Grid>
      </Stack>
    )
  }

  if (variant === 'title') {
    return <TitleSkeleton />
  }

  if (variant === 'text') {
    return <TextSkeleton />
  }

  return (
    <Stack gap="lg" className={className}>
      {items.map((i) => (
        <CardSkeleton key={i} />
      ))}
    </Stack>
  )
}

export default LoadingSkeleton
