import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui'
import TopNav from '@/components/TopNav'
import ErrorBoundary from './ErrorBoundary'
import ErrorState from './ErrorState'
import { ERROR_TYPE } from '@/consts'
import { cn, isHomeRoute } from '@/lib/utils'
import { useCurrentRoute } from '@/hooks'

interface MainContainerProps {
  children: ReactNode
}

const MainContainer = ({ children }: MainContainerProps) => {
  const currentRoute = useCurrentRoute()
  const navigate = useNavigate()

  const isHome = isHomeRoute(currentRoute.path)

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <TopNav
        currentRoute={currentRoute.type}
        onNavigate={navigate}
      />

      {/* Content area */}
      <div className="flex flex-1 flex-col px-6 md:px-10 lg:px-16">
        <div
          className={cn(
            'w-full mx-auto',
            isHome ? 'flex flex-1 flex-col justify-center items-center' : 'py-12',
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
  )
}

export default MainContainer
