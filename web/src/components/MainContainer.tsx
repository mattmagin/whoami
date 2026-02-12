import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Flex, Container } from '@/components/ui'
import Header from './layout/Header'
import Footer from './layout/Footer'
import ErrorBoundary from './ErrorBoundary'
import ErrorState from './ErrorState'
import { ERROR_TYPE } from '@/consts'

interface MainContainerProps {
  children: ReactNode
}

const MainContainer = ({ children }: MainContainerProps) => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const showHeader = !isHome
  const showFooter = !isHome

  return (
    <Flex direction="col" className="min-h-screen">
      {showHeader && <Header />}
      <main className="flex-1">
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
      {showFooter && <Footer />}
    </Flex>
  )
}

export default MainContainer
