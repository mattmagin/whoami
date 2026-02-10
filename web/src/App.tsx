import { Toaster } from 'sonner'
import { MainContainer } from '@/components'
import CommandPalette from '@/components/CommandPalette'
import ErrorBoundary from '@/components/ErrorBoundary'
import RenderErrorFallback from '@/components/RenderErrorFallback'
import Providers from './providers'
import Pages from './pages'

const App = () => {
  return (
    <Providers>
      <ErrorBoundary
        fallback={(error, reset) => (
          <RenderErrorFallback error={error} reset={reset} fullPage />
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
