import { type ReactNode, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui'
import SideNav from '@/components/SideNav'
import PageHeader from './PageHeader'
import ErrorBoundary from './ErrorBoundary'
import ErrorState from './ErrorState'
import { ROUTE, type Route } from '@/consts'
import { ERROR_TYPE } from '@/consts'
import { useContent } from '@/providers/ContentProvider'
import { cn } from '@/lib/utils'

const EXIT_DURATION = 400

/** Map a pathname to the matching Route key for SideNav highlight */
const deriveRoute = (pathname: string): Route => {
  if (pathname === '/') return ROUTE.HOME
  if (pathname.startsWith('/resume')) return ROUTE.RESUME
  if (pathname.startsWith('/projects')) return ROUTE.PROJECTS
  if (pathname.startsWith('/blog')) return ROUTE.BLOG
  if (pathname.startsWith('/contact')) return ROUTE.CONTACT
  return ROUTE.HOME
}

interface MainContainerProps {
  children: ReactNode
}

const MainContainer = ({ children }: MainContainerProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const content = useContent()

  const [exiting, setExiting] = useState(false)
  const [prevPathname, setPrevPathname] = useState(location.pathname)

  const currentRoute = deriveRoute(location.pathname)
  const isHome = location.pathname === '/'

  // Synchronously reset exiting when the route changes (before paint).
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname)
    setExiting(false)
  }

  const animateOut = useCallback(
    (cb: () => void) => {
      if (exiting) return
      setExiting(true)
      setTimeout(cb, EXIT_DURATION)
    },
    [exiting],
  )

  const handleNavigate = useCallback(
    (path: string) => {
      animateOut(() => navigate(path))
    },
    [animateOut, navigate],
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden px-6 md:px-10 lg:px-16">
      {/* Inner flex always uses items-center so SideNav stays in the same position on every page */}
      <div className="flex w-full max-w-6xl mx-auto gap-12 items-center">
        {/* Content column — border + padding shared by header and animated body */}
        <div
          className={cn(
            'flex-1 min-w-0 border-l border-primary/30 pl-6',
            !isHome && 'self-stretch flex flex-col py-12 pr-4',
          )}
        >
          {/* Persistent page header — typewriter handles enter/exit */}
          <PageHeader
            title={content?.heading ?? false}
            description={content?.subheading ?? ''}
          />

          {/* Animated content zone — keyed on pathname to replay enter animation on route change */}
          <div
            key={location.pathname}
            className={cn(
              'flex-1 min-w-0 min-h-0',
              !isHome && 'flex flex-col',
              exiting ? 'animate-slide-down' : 'animate-slide-up',
            )}
          >
            <main className={cn(!isHome && 'flex-1 min-h-0 overflow-hidden')}>
              <ErrorBoundary
                fallback={(error, reset) => (
                  <Container size="sm" padding="lg">
                    <ErrorState
                      errorType={ERROR_TYPE.RENDER}
                      detail={error.message}
                      onRetry={reset}
                      showReload
                      variant="page"
                    />
                  </Container>
                )}
              >
                {children}
              </ErrorBoundary>
            </main>
          </div>
        </div>

        {/* Side nav — persistent, never animates */}
        <SideNav
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  )
}

export default MainContainer
