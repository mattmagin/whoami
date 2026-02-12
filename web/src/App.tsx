import { Toaster } from '@/components/ui/sonner'
import { MainContainer } from '@/components'
import CommandPalette from '@/components/CommandPalette'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorState from '@/components/ErrorState'
import { Container } from '@/components/ui'
import { ERROR_TYPE } from '@/consts'
import Providers from './providers'
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
        <CommandPalette />
        <MainContainer>
          <Pages />
        </MainContainer>
        <Toaster position="bottom-center" />
      </ErrorBoundary>
    </Providers>
  )
}

export default App
