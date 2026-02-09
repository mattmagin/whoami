import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'
import { Text } from '@/components/ui'
import { useContent } from '@/providers/ContentProvider'

const TuiEntryPoint = () => {
    const [isHovered, setIsHovered] = useState(false)
    const { tuiEntry } = useContent()

    function handleClick() {
        console.log('🖥️ TUI mode activated!')
        console.log('This will open a full-screen terminal UI experience.')
        // TODO: Implement TUI mode
    }

    return (
        <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
        >
            <motion.button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative flex items-center gap-3 rounded-xl border border-primary/30 bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Terminal Icon with pulse animation */}
                <div className="relative">
                    <Terminal className="h-5 w-5 text-primary" />
                    <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </div>

                {/* Text with blinking cursor */}
                <div className="flex items-center font-mono text-sm">
                    <Text variant="muted" as="span">{tuiEntry.prompt}</Text>
                    <span className="ml-1 text-foreground">{tuiEntry.buttonText}</span>
                    <motion.span
                        className="ml-0.5 inline-block h-4 w-[2px] bg-primary"
                        animate={{ opacity: [1, 0] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                </div>

                {/* Hover hint */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute -top-10 right-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg"
                        >
                            {tuiEntry.hoverHint}
                            <div className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-primary" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Keyboard shortcut hint */}
            <motion.div
                className="mt-2 text-center text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                {tuiEntry.keyboardHint} <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">{tuiEntry.keyboardShortcut}</kbd> {tuiEntry.keyboardHintSuffix}
            </motion.div>
        </motion.div>
    )
}

export default TuiEntryPoint
