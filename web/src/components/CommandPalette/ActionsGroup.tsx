import { Terminal } from 'lucide-react'
import { CommandItem } from '@/components/ui/command'

const SSH_COMMAND = 'ssh magin.tech'

interface ActionsGroupProps {
  onCopySsh: () => void
}

/** SSH copy item (rendered inside a parent CommandGroup) */
const ActionsGroup = ({
  onCopySsh,
}: ActionsGroupProps) => (
  <>
    <CommandItem
      value="copy ssh command terminal"
      onSelect={onCopySsh}
    >
      <Terminal className="h-4 w-4" />
      Copy SSH Command
      <span className="ml-auto font-mono text-xs text-muted-foreground">
        {SSH_COMMAND}
      </span>
    </CommandItem>
  </>
)

export default ActionsGroup
