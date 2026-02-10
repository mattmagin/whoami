import { useState } from 'react'
import { Terminal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCopyToClipboard } from 'usehooks-ts'
import { Flex } from '@/components/ui'
import CopyButton from '@/components/CopyButton'
import { useContent } from '@/providers/ContentProvider'
import { cn } from '@/lib/utils'

interface SshCommandProps {
    showHint?: boolean
    showTooltip?: boolean
    className?: string
}

const SshCommand = ({ showHint = false, showTooltip = false, className }: SshCommandProps) => {
    const { common, home, tuiEntry } = useContent()
    const [hovered, setHovered] = useState(false)
    const [, copy] = useCopyToClipboard()

    const handleCopy = () => {
        copy(common.sshCommand)
    }

    return (
        <div
            className={cn('relative z-10 w-fit', className)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Flex
                align="center"
                gap="xs"
                onClick={handleCopy}
                className="cursor-pointer rounded-lg bg-muted/50 pl-4 pr-1 py-1 font-mono text-sm text-muted-foreground"
            >
                <Terminal className="h-4 w-4" />
                <span>{showHint ? `${home.sshHint} ` : ''}{common.sshCommand}</span>
                <CopyButton text={common.sshCommand} className="h-8 w-8" />
            </Flex>

            {showTooltip && (
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full z-50 mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg whitespace-nowrap"
                        >
                            {tuiEntry.hoverHint}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-primary" />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    )
}

export default SshCommand
