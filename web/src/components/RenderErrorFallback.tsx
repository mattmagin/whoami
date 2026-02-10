import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, RotateCcw } from 'lucide-react'
import { Button, Text, Stack, Container } from '@/components/ui'
import { ERROR_TYPE, ERROR_DEFINITIONS } from '@/consts'

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

interface RenderErrorFallbackProps {
    error: Error
    reset: () => void
    /** When true, shows a "Reload page" button instead of "Try again" */
    fullPage?: boolean
}

const RenderErrorFallback = ({ error, reset, fullPage = false }: RenderErrorFallbackProps) => {
    const def = ERROR_DEFINITIONS[ERROR_TYPE.RENDER]
    const code = useMemo(() => pickRandom(def.codes), [def.codes])
    const quip = useMemo(() => pickRandom(def.quips), [def.quips])

    const handleReload = () => window.location.reload()

    return (
        <Container size="sm" padding="lg">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
            >
                <Stack align="center" gap="md" className="py-16 text-center">
                    {/* Glitching icon */}
                    <motion.div
                        initial={{
                            filter: 'blur(4px)',
                            scale: 1.2,
                            rotate: -5,
                        }}
                        animate={{
                            filter: 'blur(0px)',
                            scale: 1,
                            rotate: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        <motion.div
                            animate={{
                                x: [0, -3, 3, -2, 0],
                                opacity: [1, 0.5, 1, 0.7, 1],
                            }}
                            transition={{
                                duration: 0.4,
                                times: [0, 0.2, 0.4, 0.6, 1],
                            }}
                        >
                            <AlertCircle className="h-16 w-16 text-muted-foreground" />
                        </motion.div>
                    </motion.div>

                    {/* Fake error code */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                    >
                        <code className="rounded-md bg-muted px-3 py-1.5 font-mono text-sm text-muted-foreground">
                            {code}
                        </code>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                    >
                        <Text variant="cardTitle">{def.title}</Text>
                    </motion.div>

                    {/* Quip */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                    >
                        <Text variant="muted" className="max-w-md italic">
                            &ldquo;{quip}&rdquo;
                        </Text>
                    </motion.div>

                    {/* Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                    >
                        <Text variant="muted" className="max-w-md">
                            {def.message}
                        </Text>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.3 }}
                        className="flex gap-3 pt-2"
                    >
                        {fullPage ? (
                            <Button onClick={handleReload} variant="outline">
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reload page
                            </Button>
                        ) : (
                            <>
                                <Button onClick={reset} variant="outline">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try again
                                </Button>
                                <Button onClick={handleReload} variant="ghost">
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reload page
                                </Button>
                            </>
                        )}
                    </motion.div>

                    {/* Collapsible error detail (dev-friendly) */}
                    {error.message && (
                        <motion.details
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.3 }}
                            className="mt-4 w-full max-w-md text-left"
                        >
                            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
                                Technical details
                            </summary>
                            <pre className="mt-2 overflow-auto rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
                                {error.message}
                            </pre>
                        </motion.details>
                    )}
                </Stack>
            </motion.div>
        </Container>
    )
}

export default RenderErrorFallback
