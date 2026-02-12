import CopyButton from '@/components/CopyButton'
import { useContent } from '@/providers/ContentProvider'
import { cn } from '@/lib/utils'

interface TerminalCardProps {
    className?: string
}

const TerminalCard = ({ className }: TerminalCardProps) => {
    const { common } = useContent()

    return (
        <div
            className={cn(
                'w-full max-w-md rounded-lg border border-border bg-card/80 shadow-lg backdrop-blur-sm overflow-hidden',
                className,
            )}
        >
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs font-medium text-muted-foreground">Terminal</span>
            </div>

            {/* Terminal body */}
            <div className="px-4 py-4 font-mono text-sm leading-relaxed">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0">
                        <span className="text-primary">$</span>
                        <span className="ml-2 text-foreground">{common.sshCommand}</span>
                        <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-primary" />
                    </div>
                    <CopyButton text={common.sshCommand} className="h-7 w-7 shrink-0" />
                </div>
                <p className="mt-2 text-muted-foreground/70 text-xs">
                    Connecting to magin.tech...
                </p>
            </div>
        </div>
    )
}

export default TerminalCard
