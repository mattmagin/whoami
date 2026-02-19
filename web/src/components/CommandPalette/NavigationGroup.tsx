import { CommandGroup, CommandItem, CommandShortcut } from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { NAV_ROUTES, ROUTE_DEFINITIONS } from '@/consts'

interface NavigationGroupProps {
    heading: string
    onSelect: (path: string) => void
}

const NavigationGroup = ({ heading, onSelect }: NavigationGroupProps) => (
    <CommandGroup heading={heading}>
        {NAV_ROUTES.map((route) => {
            const { path, label, icon: Icon, shortcuts } = ROUTE_DEFINITIONS[route]
            if (!Icon) return null
            return (
                <CommandItem
                    key={route}
                    value={route}
                    onSelect={() => onSelect(path)}
                >
                    <Icon className="h-4 w-4" />
                    {label}
                    {shortcuts && shortcuts.length > 0 && (
                        <CommandShortcut className="flex gap-1">
                            {shortcuts.map((key) => (
                                <Kbd key={key}>{key.toUpperCase()}</Kbd>
                            ))}
                        </CommandShortcut>
                    )}
                </CommandItem>
            )
        })}
    </CommandGroup>
)

export default NavigationGroup
