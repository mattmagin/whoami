import { cn } from '@/lib/utils'

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
  <div className="rounded-lg border border-border p-6">
    <Skeleton className="mb-4 h-6 w-3/4" />
    <Skeleton className="mb-2 h-4 w-full" />
    <Skeleton className="mb-4 h-4 w-2/3" />
    <div className="flex gap-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-16" />
    </div>
  </div>
)

const TextSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-4/6" />
  </div>
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
      <div className={cn('space-y-8', className)}>
        <TitleSkeleton />
        <TextSkeleton />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'title') {
    return <TitleSkeleton />
  }

  if (variant === 'text') {
    return <TextSkeleton />
  }

  return (
    <div className={cn('space-y-6', className)}>
      {items.map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export default LoadingSkeleton
