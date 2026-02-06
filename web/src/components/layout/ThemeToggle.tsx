import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeContext } from '@/hooks/ThemeContext'

const ThemeToggle = () => {
  const { themeKey, toggleTheme } = useThemeContext()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${themeKey === 'light' ? 'dark' : 'light'} mode`}
      className="relative"
    >
      {themeKey === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}

export default ThemeToggle
