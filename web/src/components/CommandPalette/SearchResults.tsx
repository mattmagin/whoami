import { Command } from 'cmdk'
import { THEME_OPTIONS, COLOR_THEME_DEFINITIONS, type ColorTheme, type ThemePreference } from '@/consts'

const colorEntries = Object.entries(COLOR_THEME_DEFINITIONS) as [ColorTheme, (typeof COLOR_THEME_DEFINITIONS)[ColorTheme]][]

interface SearchResultsProps {
  colorThemeHeading: string
  colorTheme: ColorTheme
  preference: ThemePreference
  itemClass: string
  onSelectColor: (key: ColorTheme) => void
  onSelectTheme: (value: ThemePreference) => void
}

const SearchResults = ({
  colorThemeHeading,
  colorTheme,
  preference,
  itemClass,
  onSelectColor,
  onSelectTheme,
}: SearchResultsProps) => (
  <>
    <Command.Group heading={colorThemeHeading} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {colorEntries.map(([key, { label, preview, aliases }]) => (
        <Command.Item
          key={key}
          value={`change to ${label} accent color ${aliases.join(' ')}`}
          onSelect={() => onSelectColor(key)}
          className={itemClass}
        >
          <span
            className="inline-block h-4 w-4 rounded-full border border-border"
            style={{ backgroundColor: preview }}
          />
          Change to {label} accent
          {colorTheme === key && (
            <span className="ml-auto text-xs text-muted-foreground">current</span>
          )}
        </Command.Item>
      ))}
    </Command.Group>
    <Command.Group heading="Theme" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
        <Command.Item
          key={value}
          value={`change to ${label} mode theme`}
          onSelect={() => onSelectTheme(value)}
          className={itemClass}
        >
          <Icon className="h-4 w-4" />
          Change to {label} mode
          {preference === value && (
            <span className="ml-auto text-xs text-muted-foreground">current</span>
          )}
        </Command.Item>
      ))}
    </Command.Group>
  </>
)

export default SearchResults
