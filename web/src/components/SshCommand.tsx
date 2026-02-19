import { useState } from 'react'
import { Terminal } from 'lucide-react'
import { useCopyToClipboard } from 'usehooks-ts'
import { Flex } from '@/components/ui'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import CopyButton from '@/components/CopyButton'
import { cn } from '@/lib/utils'

const SSH_COMMAND = 'ssh magin.tech'

interface SshCommandProps {
    showHint?: boolean
    showTooltip?: boolean
    className?: string
}

const SshCommand = ({ showHint = false, showTooltip = false, className }: SshCommandProps) => {
    const [, copy] = useCopyToClipboard()
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        const success = await copy(SSH_COMMAND)
        if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const commandBar = (
        <Flex
            align="center"
            gap="xs"
            onClick={handleCopy}
            className="cursor-pointer rounded-lg bg-muted/50 pl-4 pr-1 py-1 font-mono text-sm text-muted-foreground"
        >
            <Terminal className="h-4 w-4" />
            <span>{showHint ? 'Or try: ' : ''}{SSH_COMMAND}</span>
            <CopyButton text={SSH_COMMAND} copied={copied} onCopy={handleCopy} className="h-8 w-8" />
        </Flex>
    )

    if (!showTooltip) {
        return <div className={cn('relative z-10 w-fit', className)}>{commandBar}</div>
    }

    return (
        <div className={cn('relative z-10 w-fit', className)}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {commandBar}
                </TooltipTrigger>
                <TooltipContent>
                    Try the TUI experience! Click to copy command to clipboard.
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

export default SshCommand
