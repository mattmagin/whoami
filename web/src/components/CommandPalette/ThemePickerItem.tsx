import { forwardRef } from 'react'
import { Command } from 'cmdk'
import { THEME_OPTIONS, type ThemePreference } from '@/consts'

interface ThemePickerItemProps {
    preference: ThemePreference
    itemClass: string
    onSelect: () => void
    onPick: (value: ThemePreference) => void
}

const ThemePickerItem = forwardRef<HTMLDivElement, ThemePickerItemProps>(
    ({ preference, itemClass, onSelect, onPick }, ref) => {
        const currentOpt = THEME_OPTIONS.find((o) => o.value === preference)
        const CurrentIcon = currentOpt?.icon
        const currentLabel = currentOpt?.label ?? 'System'

        return (
            <Command.Item
                ref={ref}
                value="toggle theme dark light system mode"
                onSelect={onSelect}
                className={`group ${itemClass}`}
            >
                {CurrentIcon && <CurrentIcon className="h-4 w-4" />}
                Theme

                {/* Default: show current theme label */}
                <span className="ml-auto text-xs text-muted-foreground group-hover:hidden group-aria-selected:hidden">
                    {currentLabel}
                </span>

                {/* Hovered / selected: show theme pills */}
                <span className="ml-auto hidden items-center gap-0.5 rounded-lg bg-muted p-0.5 group-hover:flex group-aria-selected:flex">
                    {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
                        <button
                            key={value}
                            onClick={(e) => {
                                e.stopPropagation()
                                onPick(value)
                            }}
                            aria-label={label}
                            title={label}
                            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${preference === value
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon className="h-3 w-3" />
                            {label}
                        </button>
                    ))}
                </span>
            </Command.Item>
        )
    },
)

ThemePickerItem.displayName = 'ThemePickerItem'

export default ThemePickerItem
