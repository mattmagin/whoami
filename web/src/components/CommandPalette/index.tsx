import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { useThemeContext } from '@/providers/ThemeProvider'
import { useContent } from '@/providers/ContentProvider'
import { STORAGE_KEYS } from '@/consts'
import { getStorageItem, setStorageItem } from '@/lib/localStorage'
import useCommandPaletteKeys from './useCommandPaletteKeys'
import useThemePreview from './useThemePreview'
import NavigationGroup from './NavigationGroup'
import ActionsGroup from './ActionsGroup'
import ThemePickerItem from './ThemePickerItem'
import ColorPickerItem from './ColorPickerItem'
import SearchResults from './SearchResults'

const ITEM_CLASS = 'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent'

const CommandPalette = () => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [highlightedValue, setHighlightedValue] = useState('')
    const navigate = useNavigate()
    const { preference, colorTheme, setTheme, setColorTheme } = useThemeContext()
    const [, copy] = useCopyToClipboard()
    const { common, nav, commandPalette: cp } = useContent()!

    const appearanceRef = useRef<HTMLDivElement>(null)
    const themeRef = useRef<HTMLDivElement>(null)

    const [boringMode, setBoringMode] = useState(
        () => getStorageItem(STORAGE_KEYS.BORING_MODE) === 'true',
    )

    // Sync boring-mode state when palette opens
    const handleOpenChange = useCallback((next: boolean) => {
        if (next) setBoringMode(getStorageItem(STORAGE_KEYS.BORING_MODE) === 'true')
        setOpen(next)
    }, [])

    // Global keyboard shortcuts
    useCommandPaletteKeys(open, setOpen, navigate)

    // Theme/color preview, revert, cycling, commit
    const { commitColor, commitTheme } = useThemePreview({
        open,
        search,
        highlightedValue,
        preference,
        colorTheme,
        setTheme,
        setColorTheme,
        appearanceRef,
        themeRef,
    })

    /** Close palette, clear search, then run the command */
    const runCommand = useCallback((command: () => void) => {
        setOpen(false)
        setSearch('')
        command()
    }, [])

    const handleToggleBoring = useCallback(() => {
        setBoringMode((prev) => {
            const next = !prev
            setStorageItem(STORAGE_KEYS.BORING_MODE, next ? 'true' : 'false')
            return next
        })
    }, [])

    return (
        <Command.Dialog
            open={open}
            onOpenChange={handleOpenChange}
            value={highlightedValue}
            onValueChange={setHighlightedValue}
            label="Command Menu"
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                {/* Search Input */}
                <div className="flex items-center border-b border-border px-4">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Command.Input
                        value={search}
                        onValueChange={(v) => setSearch(v.trimStart())}
                        placeholder={cp.placeholder}
                        className="flex-1 bg-transparent py-4 px-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <kbd className="hidden rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground sm:inline-block">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <Command.List className="max-h-[28rem] overflow-y-auto p-2">
                    <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                        {cp.noResults}
                    </Command.Empty>

                    <NavigationGroup
                        heading={cp.navigation}
                        nav={nav}
                        itemClass={ITEM_CLASS}
                        onSelect={(path) => runCommand(() => navigate(path))}
                    />

                    <Command.Group heading={cp.actions} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        <ActionsGroup
                            sshCommand={common.sshCommand}
                            copySshLabel={cp.copySshCommand}
                            boringModeLabel={cp.boringMode}
                            boringMode={boringMode}
                            itemClass={ITEM_CLASS}
                            onCopySsh={() => runCommand(() => {
                                copy(common.sshCommand)
                                toast(cp.copiedToClipboard)
                            })}
                            onToggleBoring={handleToggleBoring}
                        />

                        <ThemePickerItem
                            ref={themeRef}
                            preference={preference}
                            itemClass={ITEM_CLASS}
                            onSelect={() => { commitTheme(); setOpen(false); setSearch('') }}
                            onPick={(value) => { commitTheme(); setTheme(value) }}
                        />

                        <ColorPickerItem
                            ref={appearanceRef}
                            colorTheme={colorTheme}
                            appearanceLabel={cp.appearance}
                            itemClass={ITEM_CLASS}
                            onSelect={() => { commitColor(); setOpen(false); setSearch('') }}
                            onPick={(key) => { commitColor(); setColorTheme(key) }}
                        />
                    </Command.Group>

                    {/* Search-only items — visible only when user is searching */}
                    {search && (
                        <SearchResults
                            colorThemeHeading={cp.colorTheme}
                            colorTheme={colorTheme}
                            preference={preference}
                            itemClass={ITEM_CLASS}
                            onSelectColor={(key) => { commitColor(); runCommand(() => setColorTheme(key)) }}
                            onSelectTheme={(value) => { commitTheme(); runCommand(() => setTheme(value)) }}
                        />
                    )}
                </Command.List>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
                    <span>{cp.navigateHint}</span>
                    <span>
                        <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">↵</kbd> {cp.selectHint}
                    </span>
                </div>
            </div>
        </Command.Dialog>
    )
}

export default CommandPalette
