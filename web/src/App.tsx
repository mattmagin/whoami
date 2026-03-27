import { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorState from '@/components/ErrorState'
import { Container } from '@/components/ui'
import { ERROR_TYPE } from '@/consts'
import Providers from './providers'
import NewContainer from '@/components/Container'
import Navigation from '@/components/Navigation'
import Pages from './pages'

const App = () => {
  return (
    <Providers>
      <ErrorBoundary
        fallback={(error) => (
          <Container size="sm" padding="lg">
            <ErrorState
              errorType={ERROR_TYPE.RENDER}
              detail={error.message}
              showReload
              variant="page"
            />
          </Container>
        )}
      >
        <NewContainer>
          <Navigation />
          <Suspense>
            <Pages />
          </Suspense>
        </NewContainer>
      </ErrorBoundary>
      <Toaster position="bottom-center" />
    </Providers>
  )
}

export default App
