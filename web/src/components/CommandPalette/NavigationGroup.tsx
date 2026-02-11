import { Command } from 'cmdk'
import { NAV_ROUTES, ROUTE_DEFINITIONS } from '@/consts'
import type { Strings } from '@/providers/ContentProvider'

interface NavigationGroupProps {
    heading: string
    nav: Strings['nav']
    itemClass: string
    onSelect: (path: string) => void
}

const NavigationGroup = ({ heading, nav, itemClass, onSelect }: NavigationGroupProps) => (
    <Command.Group heading={heading} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
        {NAV_ROUTES.map((route) => {
            const { path, labelKey, icon: Icon, shortcuts } = ROUTE_DEFINITIONS[route]
            if (!Icon) return null
            return (
                <Command.Item
                    key={route}
                    value={route}
                    onSelect={() => onSelect(path)}
                    className={itemClass}
                >
                    <Icon className="h-4 w-4" />
                    {nav[labelKey]}
                    {shortcuts && shortcuts.length > 0 && (
                        <span className="ml-auto flex gap-1">
                            {shortcuts.map((key) => (
                                <kbd key={key} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                                    {key.toUpperCase()}
                                </kbd>
                            ))}
                        </span>
                    )}
                </Command.Item>
            )
        })}
    </Command.Group>
)

export default NavigationGroup
