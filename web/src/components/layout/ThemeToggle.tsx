import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui'
import { useThemeContext } from '@/providers/ThemeProvider'
import { THEME_MODE } from '@/consts'

const ThemeToggle = () => {
  const { themeKey, toggleTheme } = useThemeContext()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${themeKey === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT} mode`}
      className="relative"
    >
      {themeKey === THEME_MODE.LIGHT ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}

export default ThemeToggle
