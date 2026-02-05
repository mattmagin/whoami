import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { useCopyToClipboard } from 'usehooks-ts'
import {
  Home,
  FileText,
  FolderKanban,
  BookOpen,
  Mail,
  Sun,
  Moon,
  Terminal,
  Search,
} from 'lucide-react'
import { useThemeContext } from '@/hooks/ThemeContext'
import { useStrings } from '@/content'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeContext()
  const [, copy] = useCopyToClipboard()
  const { common, nav, commandPalette } = useStrings()

  // Toggle the menu when ⌘K or Ctrl+K is pressed
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    setSearch('')
    command()
  }, [])

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
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
            onValueChange={setSearch}
            placeholder={commandPalette.placeholder}
            className="flex-1 bg-transparent py-4 px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            {commandPalette.noResults}
          </Command.Empty>

          {/* Navigation */}
          <Command.Group heading={commandPalette.navigation} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            <Command.Item
              value="home"
              onSelect={() => runCommand(() => navigate('/'))}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
            >
              <Home className="h-4 w-4" />
              {nav.home}
            </Command.Item>
            <Command.Item
              value="resume"
              onSelect={() => runCommand(() => navigate('/resume'))}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
            >
              <FileText className="h-4 w-4" />
              {nav.resume}
            </Command.Item>
            <Command.Item
              value="projects"
              onSelect={() => runCommand(() => navigate('/projects'))}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
            >
              <FolderKanban className="h-4 w-4" />
              {nav.projects}
            </Command.Item>
            <Command.Item
              value="blog"
              onSelect={() => runCommand(() => navigate('/blog'))}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
            >
              <BookOpen className="h-4 w-4" />
              {nav.blog}
            </Command.Item>
            <Command.Item
              value="contact"
              onSelect={() => runCommand(() => navigate('/contact'))}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
            >
              <Mail className="h-4 w-4" />
              {nav.contact}
            </Command.Item>
          </Command.Group>

          {/* Actions */}
          <Command.Group heading={commandPalette.actions} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            <Command.Item
              value="toggle theme dark light mode"
              onSelect={() => runCommand(toggleTheme)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              {commandPalette.toggleTheme}
              <span className="ml-auto text-xs text-muted-foreground">
                {commandPalette.currentlyLabel} {theme}
              </span>
            </Command.Item>
            <Command.Item
              value="copy ssh command terminal"
              onSelect={() => runCommand(() => copy(common.sshCommand))}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
            >
              <Terminal className="h-4 w-4" />
              {commandPalette.copySshCommand}
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {common.sshCommand}
              </span>
            </Command.Item>
          </Command.Group>
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
