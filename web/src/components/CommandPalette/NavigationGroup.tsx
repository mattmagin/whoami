import { CommandGroup, CommandItem, CommandShortcut } from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { NAV_ROUTES, ROUTE_DEFINITIONS } from '@/consts'
import type { Strings } from '@/providers/ContentProvider'

interface NavigationGroupProps {
    heading: string
    nav: Strings['nav']
    onSelect: (path: string) => void
}

const NavigationGroup = ({ heading, nav, onSelect }: NavigationGroupProps) => (
    <CommandGroup heading={heading}>
        {NAV_ROUTES.map((route) => {
            const { path, labelKey, icon: Icon, shortcuts } = ROUTE_DEFINITIONS[route]
            if (!Icon) return null
            return (
                <CommandItem
                    key={route}
                    value={route}
                    onSelect={() => onSelect(path)}
                >
                    <Icon className="h-4 w-4" />
                    {nav[labelKey]}
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
