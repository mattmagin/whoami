import type { ReactNode } from 'react'
import { Flex } from '@/components/ui'
import Header from './layout/Header'
import Footer from './layout/Footer'
import ErrorBoundary from './ErrorBoundary'
import RenderErrorFallback from './RenderErrorFallback'

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
            <RenderErrorFallback error={error} reset={reset} />
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
