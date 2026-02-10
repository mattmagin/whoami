import { Command } from 'cmdk'
import { Terminal, Zap, ZapOff } from 'lucide-react'

interface ActionsGroupProps {
  sshCommand: string
  copySshLabel: string
  boringModeLabel: string
  boringMode: boolean
  itemClass: string
  onCopySsh: () => void
  onToggleBoring: () => void
}

/** SSH copy and boring-mode toggle items (rendered inside a parent Command.Group) */
const ActionsGroup = ({
  sshCommand,
  copySshLabel,
  boringModeLabel,
  boringMode,
  itemClass,
  onCopySsh,
  onToggleBoring,
}: ActionsGroupProps) => (
  <>
    <Command.Item
      value="copy ssh command terminal"
      onSelect={onCopySsh}
      className={itemClass}
    >
      <Terminal className="h-4 w-4" />
      {copySshLabel}
      <span className="ml-auto font-mono text-xs text-muted-foreground">
        {sshCommand}
      </span>
    </Command.Item>
    <Command.Item
      value="toggle boring mode animations"
      onSelect={onToggleBoring}
      className={itemClass}
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
    </Command.Item>
  </>
)

export default ActionsGroup
