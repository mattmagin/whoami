import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useContent } from '@/providers/ContentProvider'
import { NAV_ROUTES, ROUTE_DEFINITIONS } from '@/consts'

const Header = () => {
  const location = useLocation()
  const { nav, aria } = useContent()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-theme">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-xl font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          {nav.portfolio}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ROUTES.map((route) => {
            const { path, labelKey } = ROUTE_DEFINITIONS[route]
            return (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${location.pathname === path
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
              >
                {nav[labelKey]}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={aria.toggleMenu}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{nav.portfolio}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 px-4">
                {NAV_ROUTES.map((route) => {
                  const { path, labelKey } = ROUTE_DEFINITIONS[route]
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${location.pathname === path
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                    >
                      {nav[labelKey]}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
