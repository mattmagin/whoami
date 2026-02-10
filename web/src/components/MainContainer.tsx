import type { ReactNode } from 'react'
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
  return (
    <Flex direction="col" className="min-h-screen">
      <Header />
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
      <Footer />
    </Flex>
  )
}

export default MainContainer
