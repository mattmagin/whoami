import { Toaster } from '@/components/ui/sonner'
import { Button, Text } from '@/components/ui'
import { MainContainer } from '@/components'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorState from '@/components/ErrorState'
import { Container } from '@/components/ui'
import { ERROR_TYPE } from '@/consts'
import Providers from './providers'
import Pages from './pages'
import NewContainer, { HORIZONTAL_PADDING } from '@/components/new/Container'
import Navigation from './components/new/Navigation'
import Home from './pages/Home'
import AboutSection from './components/new/AboutSection'
import styled from '@emotion/styled'

export const SectionContentContainer = styled.div`
  width: 100%;
  padding: 0 ${HORIZONTAL_PADDING}px;
`

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
          <Home />
          <AboutSection />
        </NewContainer>
        {/* <MainContainer>
          <Pages />
        </MainContainer> */}
        <Toaster position="bottom-center" />
      </ErrorBoundary>
    </Providers>
  )
}

export default App
