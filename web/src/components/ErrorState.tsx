import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button, Text, Stack } from '@/components/ui'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

const ErrorState = ({
  title = 'Something went wrong',
  message = 'We couldn\'t load the content. Please try again.',
  onRetry,
}: ErrorStateProps) => {
  return (
    <Stack align="center" gap="md" className="rounded-lg border border-dashed border-border p-12 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <Text variant="cardTitle">{title}</Text>
      <Text variant="muted" className="max-w-md">{message}</Text>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}
    </Stack>
  )
}

export default ErrorState
