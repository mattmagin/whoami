import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command as CommandPrimitive } from 'cmdk'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Command, CommandList, CommandEmpty, CommandGroup } from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
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
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
                <DialogHeader className="sr-only">
                    <DialogTitle>Command Menu</DialogTitle>
                    <DialogDescription>{cp.placeholder}</DialogDescription>
                </DialogHeader>
                <Command
                    value={highlightedValue}
                    onValueChange={setHighlightedValue}
                    className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0"
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-2 border-b px-3">
                        <Search className="size-4 shrink-0 opacity-50" />
                        <CommandPrimitive.Input
                            value={search}
                            onValueChange={(v) => setSearch(v.trimStart())}
                            placeholder={cp.placeholder}
                            className="flex h-12 w-full bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground"
                        />
                        <Kbd className="hidden sm:inline-flex">ESC</Kbd>
                    </div>

                    {/* Results */}
                    <CommandList className="max-h-[28rem]">
                        <CommandEmpty>{cp.noResults}</CommandEmpty>

                        <NavigationGroup
                            heading={cp.navigation}
                            nav={nav}
                            onSelect={(path) => runCommand(() => navigate(path))}
                        />

                        <CommandGroup heading={cp.actions}>
                            <ActionsGroup
                                sshCommand={common.sshCommand}
                                copySshLabel={cp.copySshCommand}
                                boringModeLabel={cp.boringMode}
                                boringMode={boringMode}
                                onCopySsh={() => runCommand(() => {
                                    copy(common.sshCommand)
                                    toast(cp.copiedToClipboard)
                                })}
                                onToggleBoring={handleToggleBoring}
                            />

                            <ThemePickerItem
                                ref={themeRef}
                                preference={preference}
                                onSelect={() => { commitTheme(); setOpen(false); setSearch('') }}
                                onPick={(value) => { commitTheme(); setTheme(value) }}
                            />

                            <ColorPickerItem
                                ref={appearanceRef}
                                colorTheme={colorTheme}
                                appearanceLabel={cp.appearance}
                                onSelect={() => { commitColor(); setOpen(false); setSearch('') }}
                                onPick={(key) => { commitColor(); setColorTheme(key) }}
                            />
                        </CommandGroup>

                        {/* Search-only items — visible only when user is searching */}
                        {search && (
                            <SearchResults
                                colorThemeHeading={cp.colorTheme}
                                colorTheme={colorTheme}
                                preference={preference}
                                onSelectColor={(key) => { commitColor(); runCommand(() => setColorTheme(key)) }}
                                onSelectTheme={(value) => { commitTheme(); runCommand(() => setTheme(value)) }}
                            />
                        )}
                    </CommandList>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
                        <span>{cp.navigateHint}</span>
                        <span>
                            <Kbd>↵</Kbd> {cp.selectHint}
                        </span>
                    </div>
                </Command>
            </DialogContent>
        </Dialog>
    )
}

export default CommandPalette
