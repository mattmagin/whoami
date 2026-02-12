import { CommandGroup, CommandItem } from '@/components/ui/command'
import { THEME_OPTIONS, COLOR_THEME_DEFINITIONS, type ColorTheme, type ThemePreference } from '@/consts'

const colorEntries = Object.entries(COLOR_THEME_DEFINITIONS) as [ColorTheme, (typeof COLOR_THEME_DEFINITIONS)[ColorTheme]][]

interface SearchResultsProps {
    colorThemeHeading: string
    colorTheme: ColorTheme
    preference: ThemePreference
    onSelectColor: (key: ColorTheme) => void
    onSelectTheme: (value: ThemePreference) => void
}

const SearchResults = ({
    colorThemeHeading,
    colorTheme,
    preference,
    onSelectColor,
    onSelectTheme,
}: SearchResultsProps) => (
    <>
        <CommandGroup heading={colorThemeHeading}>
            {colorEntries.map(([key, { label, preview, aliases }]) => (
                <CommandItem
                    key={key}
                    value={`change to ${label} accent color ${aliases.join(' ')}`}
                    onSelect={() => onSelectColor(key)}
                >
                    <span
                        className="inline-block h-4 w-4 rounded-full border border-border"
                        style={{ backgroundColor: preview }}
                    />
                    Change to {label} accent
                    {colorTheme === key && (
                        <span className="ml-auto text-xs text-muted-foreground">current</span>
                    )}
                </CommandItem>
            ))}
        </CommandGroup>
        <CommandGroup heading="Theme">
            {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
                <CommandItem
                    key={value}
                    value={`change to ${label} mode theme`}
                    onSelect={() => onSelectTheme(value)}
                >
                    <Icon className="h-4 w-4" />
                    Change to {label} mode
                    {preference === value && (
                        <span className="ml-auto text-xs text-muted-foreground">current</span>
                    )}
                </CommandItem>
            ))}
        </CommandGroup>
    </>
)

export default SearchResults
