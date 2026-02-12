import { Terminal, Zap, ZapOff } from 'lucide-react'
import { CommandItem } from '@/components/ui/command'

interface ActionsGroupProps {
  sshCommand: string
  copySshLabel: string
  boringModeLabel: string
  boringMode: boolean
  onCopySsh: () => void
  onToggleBoring: () => void
}

/** SSH copy and boring-mode toggle items (rendered inside a parent CommandGroup) */
const ActionsGroup = ({
  sshCommand,
  copySshLabel,
  boringModeLabel,
  boringMode,
  onCopySsh,
  onToggleBoring,
}: ActionsGroupProps) => (
  <>
    <CommandItem
      value="copy ssh command terminal"
      onSelect={onCopySsh}
    >
      <Terminal className="h-4 w-4" />
      {copySshLabel}
      <span className="ml-auto font-mono text-xs text-muted-foreground">
        {sshCommand}
      </span>
    </CommandItem>
    <CommandItem
      value="toggle boring mode animations"
      onSelect={onToggleBoring}
    >
      {boringMode ? (
        <ZapOff className="h-4 w-4" />
      ) : (
        <Zap className="h-4 w-4" />
      )}
      {boringModeLabel}
      <span className="ml-auto text-xs text-muted-foreground">
        {boringMode ? 'On' : 'Off'}
      </span>
    </CommandItem>
  </>
)

export default ActionsGroup
