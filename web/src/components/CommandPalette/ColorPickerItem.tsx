import { forwardRef } from 'react'
import { Command } from 'cmdk'
import { Palette } from 'lucide-react'
import { COLOR_THEME_DEFINITIONS, type ColorTheme } from '@/consts'

const colorEntries = Object.entries(COLOR_THEME_DEFINITIONS) as [ColorTheme, (typeof COLOR_THEME_DEFINITIONS)[ColorTheme]][]

interface ColorPickerItemProps {
  colorTheme: ColorTheme
  appearanceLabel: string
  itemClass: string
  onSelect: () => void
  onPick: (key: ColorTheme) => void
}

const ColorPickerItem = forwardRef<HTMLDivElement, ColorPickerItemProps>(
  ({ colorTheme, appearanceLabel, itemClass, onSelect, onPick }, ref) => {
    const currentColorDef = COLOR_THEME_DEFINITIONS[colorTheme]

    return (
      <Command.Item
        ref={ref}
        value="appearance accent color theme palette"
        onSelect={onSelect}
        className={`group ${itemClass}`}
      >
        <Palette className="h-4 w-4" />
        {appearanceLabel}

        {/* Default: show current color name */}
        <span className="ml-auto text-xs text-muted-foreground group-hover:hidden group-aria-selected:hidden">
          {currentColorDef.label}
        </span>

        {/* Hovered / selected: show color dots */}
        <span className="ml-auto hidden items-center gap-1.5 group-hover:flex group-aria-selected:flex">
          {colorEntries.map(([key, { label, preview }]) => (
            <button
              key={key}
              onClick={(e) => {
                e.stopPropagation()
                onPick(key)
              }}
              aria-label={label}
              title={label}
              className={`h-4 w-4 rounded-full transition-all ${colorTheme === key
                ? 'ring-2 ring-primary ring-offset-1 ring-offset-card scale-110'
                : 'hover:scale-110'
                }`}
              style={{ backgroundColor: preview }}
            />
          ))}
        </span>
      </Command.Item>
    )
  },
)

ColorPickerItem.displayName = 'ColorPickerItem'

export default ColorPickerItem
