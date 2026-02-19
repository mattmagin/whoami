import { type ReactNode, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui'
import TopNav from '@/components/TopNav'
import ErrorBoundary from './ErrorBoundary'
import ErrorState from './ErrorState'
import { ERROR_TYPE } from '@/consts'
import { cn, isHomeRoute } from '@/lib/utils'
import { useCurrentRoute } from '@/hooks'

const EXIT_DURATION = 400

interface MainContainerProps {
  children: ReactNode
}

const MainContainer = ({ children }: MainContainerProps) => {
  const currentRoute = useCurrentRoute()
  const navigate = useNavigate()

  const [exiting, setExiting] = useState(false)
  const [prevPathname, setPrevPathname] = useState(currentRoute.path)

  const isHome = isHomeRoute(currentRoute.path)

  // Synchronously reset exiting when the route changes (before paint).
  if (currentRoute.path !== prevPathname) {
    setPrevPathname(currentRoute.path)
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
    <div className="relative z-10 flex flex-col min-h-screen">
      <TopNav
        currentRoute={currentRoute.type}
        onNavigate={handleNavigate}
      />

      {/* Content area */}
      <div className="flex flex-1 flex-col px-6 md:px-10 lg:px-16">
        <div
          className={cn(
            'w-full max-w-6xl mx-auto',
            isHome ? 'flex flex-1 flex-col justify-center items-center' : 'py-12',
          )}
        >
          {/* Animated content zone — keyed on pathname to replay enter animation on route change */}
          <div
            key={currentRoute.path}
            className={cn(
              exiting ? 'animate-slide-down' : 'animate-slide-up',
            )}
          >
            <main>
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
      </div>
    </div>
  )
}

export default MainContainer
