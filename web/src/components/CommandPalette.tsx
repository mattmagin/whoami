import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from 'sonner'
import {
  Terminal,
  Search,
  Zap,
  ZapOff,
  Palette,
} from 'lucide-react'
import { useThemeContext } from '@/providers/ThemeProvider'
import { useContent } from '@/providers/ContentProvider'
import {
  THEME_PREFERENCE,
  THEME_OPTIONS,
  STORAGE_KEYS,
  COLOR_THEME_DEFINITIONS,
  NAV_ROUTES,
  NAV_SHORTCUTS,
  ROUTE_DEFINITIONS,
  type ColorTheme,
  type ThemePreference,
} from '@/consts'
import { getStorageItem, setStorageItem } from '@/lib/localStorage'

const colorEntries = Object.entries(COLOR_THEME_DEFINITIONS) as [ColorTheme, (typeof COLOR_THEME_DEFINITIONS)[ColorTheme]][]
const colorKeys = colorEntries.map(([key]) => key)

const themePreferenceKeys = THEME_OPTIONS.map((o) => o.value)

const CommandPalette = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { preference, colorTheme, setTheme, setColorTheme } = useThemeContext()
  const [, copy] = useCopyToClipboard()
  const { common, nav, commandPalette } = useContent()

  const appearanceRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef<HTMLDivElement>(null)

  const originalColorRef = useRef<ColorTheme>(colorTheme)
  const colorCommittedRef = useRef(false)
  const originalThemeRef = useRef<ThemePreference>(preference)
  const themeCommittedRef = useRef(false)

  const [highlightedValue, setHighlightedValue] = useState('')

  // Lookup maps: cmdk value → color/theme key (cmdk lowercases values)
  const colorValueMap = useMemo(() => {
    const map = new Map<string, ColorTheme>()
    for (const [key, { label, aliases }] of colorEntries) {
      map.set(`change to ${label} accent color ${aliases.join(' ')}`.toLowerCase(), key)
    }
    return map
  }, [])

  const themeValueMap = useMemo(() => {
    const map = new Map<string, ThemePreference>()
    for (const { value, label } of THEME_OPTIONS) {
      map.set(`change to ${label} mode theme`.toLowerCase(), value)
    }
    return map
  }, [])

  const [boringMode, setBoringMode] = useState(
    () => getStorageItem(STORAGE_KEYS.BORING_MODE) === 'true',
  )

  // Toggle the menu when ⌘K or Ctrl+K is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Single-key navigation shortcuts (only when palette is closed and no input focused)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (open) return
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return

      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return

      const path = NAV_SHORTCUTS[e.key]
      if (path) {
        e.preventDefault()
        navigate(path)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, navigate])

  // Snapshot on open; revert on dismiss if not committed
  useEffect(() => {
    if (open) {
      setBoringMode(getStorageItem(STORAGE_KEYS.BORING_MODE) === 'true')
      originalColorRef.current = colorTheme
      colorCommittedRef.current = false
      originalThemeRef.current = preference
      themeCommittedRef.current = false
    } else {
      // Palette just closed — revert uncommitted changes
      if (!colorCommittedRef.current && originalColorRef.current !== colorTheme) {
        setColorTheme(originalColorRef.current)
      }
      if (!themeCommittedRef.current && originalThemeRef.current !== preference) {
        setTheme(originalThemeRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // L/R arrow keys to cycle color/theme when their respective items are selected
  useEffect(() => {
    if (!open) return

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return

      const isAppearance = appearanceRef.current?.getAttribute('aria-selected') === 'true'
      const isTheme = themeRef.current?.getAttribute('aria-selected') === 'true'

      if (!isAppearance && !isTheme) return

      e.preventDefault()
      e.stopPropagation()

      if (isAppearance) {
        const idx = colorKeys.indexOf(colorTheme)
        const next = e.key === 'ArrowRight'
          ? colorKeys[(idx + 1) % colorKeys.length]
          : colorKeys[(idx - 1 + colorKeys.length) % colorKeys.length]
        setColorTheme(next)
      }

      if (isTheme) {
        const idx = themePreferenceKeys.indexOf(preference)
        const next = e.key === 'ArrowRight'
          ? themePreferenceKeys[(idx + 1) % themePreferenceKeys.length]
          : themePreferenceKeys[(idx - 1 + themePreferenceKeys.length) % themePreferenceKeys.length]
        setTheme(next)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, colorTheme, setColorTheme, preference, setTheme])

  // Preview color/theme when navigating search-only items.
  // Only *applies* previews — reverting is handled solely by the open/close effect.
  useEffect(() => {
    if (!open || !search) return

    const matchedColor = colorValueMap.get(highlightedValue)
    if (matchedColor) {
      setColorTheme(matchedColor)
    }

    const matchedTheme = themeValueMap.get(highlightedValue)
    if (matchedTheme) {
      setTheme(matchedTheme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedValue, search])

  /** Close palette, clear search, then run the command */
  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    setSearch('')
    command()
  }, [])

  /** Run an action without closing the palette (for settings-like toggles) */
  const runAction = useCallback((action: () => void) => {
    action()
  }, [])

  const handleToggleBoring = useCallback(() => {
    setBoringMode((prev) => {
      const next = !prev
      setStorageItem(STORAGE_KEYS.BORING_MODE, next ? 'true' : 'false')
      return next
    })
  }, [])

  const themeIcon = () => {
    const opt = THEME_OPTIONS.find((o) => o.value === preference)
    if (!opt) return null
    const Icon = opt.icon
    return <Icon className="h-4 w-4" />
  }

  const themeLabel = () => {
    const opt = THEME_OPTIONS.find((o) => o.value === preference)
    return opt?.label ?? 'System'
  }

  const currentColorDef = COLOR_THEME_DEFINITIONS[colorTheme]

  const commitColor = useCallback(() => {
    colorCommittedRef.current = true
  }, [])

  const commitTheme = useCallback(() => {
    themeCommittedRef.current = true
  }, [])

  const itemClass = "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
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
            placeholder={commandPalette.placeholder}
            className="flex-1 bg-transparent py-4 px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <Command.List className="max-h-[28rem] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            {commandPalette.noResults}
          </Command.Empty>

          {/* Navigation */}
          <Command.Group heading={commandPalette.navigation} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            {NAV_ROUTES.map((route) => {
              const { path, labelKey, icon: Icon, shortcut } = ROUTE_DEFINITIONS[route]
              if (!Icon) return null
              return (
                <Command.Item
                  key={route}
                  value={route}
                  onSelect={() => runCommand(() => navigate(path))}
                  className={itemClass}
                >
                  <Icon className="h-4 w-4" />
                  {nav[labelKey]}
                  {shortcut && (
                    <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {shortcut.toUpperCase()}
                    </kbd>
                  )}
                </Command.Item>
              )
            })}
          </Command.Group>

          {/* Actions */}
          <Command.Group heading={commandPalette.actions} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            <Command.Item
              value="copy ssh command terminal"
              onSelect={() => runCommand(() => {
                copy(common.sshCommand)
                toast(commandPalette.copiedToClipboard)
              })}
              className={itemClass}
            >
              <Terminal className="h-4 w-4" />
              {commandPalette.copySshCommand}
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {common.sshCommand}
              </span>
            </Command.Item>
            <Command.Item
              value="toggle boring mode animations"
              onSelect={() => runAction(handleToggleBoring)}
              className={itemClass}
            >
              {boringMode ? (
                <ZapOff className="h-4 w-4" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {commandPalette.boringMode}
              <span className="ml-auto text-xs text-muted-foreground">
                {boringMode ? 'On' : 'Off'}
              </span>
            </Command.Item>

            {/* Theme — inline picker */}
            <Command.Item
              ref={themeRef}
              value="toggle theme dark light system mode"
              onSelect={() => { commitTheme(); setOpen(false); setSearch('') }}
              className={`group ${itemClass}`}
            >
              {themeIcon()}
              Theme

              {/* Default: show current theme label */}
              <span className="ml-auto text-xs text-muted-foreground group-hover:hidden group-aria-selected:hidden">
                {themeLabel()}
              </span>

              {/* Hovered / selected: show theme pills */}
              <span className="ml-auto hidden items-center gap-0.5 rounded-lg bg-muted p-0.5 group-hover:flex group-aria-selected:flex">
                {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={(e) => {
                      e.stopPropagation()
                      commitTheme()
                      setTheme(value)
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

            {/* Appearance — inline color picker */}
            <Command.Item
              ref={appearanceRef}
              value="appearance accent color theme palette"
              onSelect={() => { commitColor(); setOpen(false); setSearch('') }}
              className={`group ${itemClass}`}
            >
              <Palette className="h-4 w-4" />
              {commandPalette.appearance}

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
                      commitColor()
                      setColorTheme(key)
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
          </Command.Group>

          {/* Search-only items — visible only when user is searching */}
          {search && (
            <>
              <Command.Group heading={commandPalette.colorTheme} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {colorEntries.map(([key, { label, preview, aliases }]) => (
                  <Command.Item
                    key={key}
                    value={`change to ${label} accent color ${aliases.join(' ')}`}
                    onSelect={() => { commitColor(); runCommand(() => setColorTheme(key)) }}
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
                    onSelect={() => { commitTheme(); runCommand(() => setTheme(value)) }}
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
          )}
        </Command.List>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <span>{commandPalette.navigateHint}</span>
          <span>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">↵</kbd> {commandPalette.selectHint}
          </span>
        </div>
      </div>
    </Command.Dialog>
  )
}

export default CommandPalette
