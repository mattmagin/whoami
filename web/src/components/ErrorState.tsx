import { useMemo, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, RotateCcw } from 'lucide-react'
import { Button, Text, Stack, Badge } from '@/components/ui'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { ERROR_TYPE, ERROR_DEFINITIONS, type ErrorType } from '@/consts'

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

/** Animated wifi/signal bars that drop one by one */
const WifiDropIcon = () => {
  const barHeights = [8, 14, 20, 26]
  const barWidth = 4
  const gap = 3
  const totalWidth = barHeights.length * (barWidth + gap) - gap
  const totalHeight = 30

  return (
    <div className="flex h-16 w-16 items-center justify-center">
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="text-muted-foreground"
      >
        {barHeights.map((height, i) => (
          <motion.rect
            key={i}
            x={i * (barWidth + gap)}
            y={totalHeight - height}
            width={barWidth}
            rx={1}
            fill="currentColor"
            animate={{
              height: [height, 2, 2, height],
              opacity: [1, 0.25, 0.25, 1],
            }}
            transition={{
              delay: i * 0.15,
              duration: 2.4,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

/** Glitching alert icon for render errors */
const GlitchIcon = () => (
  <motion.div
    initial={{ filter: 'blur(4px)', scale: 1.2, rotate: -5 }}
    animate={{ filter: 'blur(0px)', scale: 1, rotate: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    <motion.div
      animate={{ x: [0, -3, 3, -2, 0], opacity: [1, 0.5, 1, 0.7, 1] }}
      transition={{ duration: 0.4, times: [0, 0.2, 0.4, 0.6, 1] }}
    >
      <AlertCircle className="h-16 w-16 text-muted-foreground" />
    </motion.div>
  </motion.div>
)

const ErrorIcon = ({ errorType }: { errorType: ErrorType }) => {
  if (errorType === ERROR_TYPE.RENDER) return <GlitchIcon />
  return <WifiDropIcon />
}

interface ErrorStateProps {
  /** Which error definition to use for defaults. Defaults to FETCH. */
  errorType?: ErrorType
  title?: string
  message?: string
  statusCode?: number
  detail?: string | null
  onRetry?: () => void
  /** Show a "Reload page" button */
  showReload?: boolean
  /** Custom action content rendered below the message (instead of / in addition to retry) */
  actions?: ReactNode
  /**
   * 'card' — dashed border, for inline use within a page (default)
   * 'page' — borderless with extra padding, for full-page error states
   */
  variant?: 'card' | 'page'
}

const ErrorState = ({
  errorType = ERROR_TYPE.FETCH,
  title,
  message,
  statusCode,
  detail,
  onRetry,
  showReload = false,
  actions,
  variant = 'card',
}: ErrorStateProps) => {
  const def = ERROR_DEFINITIONS[errorType]
  const displayTitle = title ?? def.title
  const displayMessage = message ?? def.message
  const quip = useMemo(() => pickRandom(def.quips), [def.quips])
  const code = useMemo(() => pickRandom(def.codes), [def.codes])

  const wrapperClass = variant === 'card'
    ? 'rounded-lg border border-dashed border-border p-12 text-center'
    : 'py-16 text-center'

  const hasActions = actions || onRetry || showReload

  return (
    <motion.div
      initial={{ opacity: 0, y: variant === 'card' ? 10 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: variant === 'page' ? 0.5 : 0 }}
    >
      <Stack align="center" gap="md" className={wrapperClass}>
        {/* Icon */}
        <ErrorIcon errorType={errorType} />

        {/* Error code badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <code className="rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
            {code}
          </code>
        </motion.div>

        {/* Status code badge */}
        {statusCode != null && statusCode > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <Badge variant="secondary" className="font-mono">
              {statusCode}
            </Badge>
          </motion.div>
        )}

        <Text variant="cardTitle">{displayTitle}</Text>

        {/* Quip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <Text variant="muted" className="max-w-md italic">
            &ldquo;{quip}&rdquo;
          </Text>
        </motion.div>

        <Text variant="muted" className="max-w-md">{displayMessage}</Text>

        {/* Detail */}
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="w-full max-w-md text-left"
          >
            <Collapsible>
              <CollapsibleTrigger className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
                Details
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-2 overflow-auto rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
                  {detail}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        )}

        {/* Actions */}
        {hasActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.3 }}
            className="flex gap-3 pt-2"
          >
            {actions}
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            )}
            {showReload && (
              <Button onClick={() => window.location.reload()} variant={onRetry ? 'ghost' : 'outline'}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reload page
              </Button>
            )}
          </motion.div>
        )}
      </Stack>
    </motion.div>
  )
}

export default ErrorState
