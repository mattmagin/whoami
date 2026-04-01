import { useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorState from '@/components/ErrorState'
import { Container } from '@/components/ui'
import { ERROR_TYPE, ROUTE_DEFINITIONS } from '@/consts'
import Providers from '@/providers/index'
import PageContainer from '@/components/PageContainer'
import NavigationBar from '@/components/NavigationBar'
import Pages from '@/pages/index'
import DesktopWidgets from '@/components/Desktop'

const isChromelessRoute = (pathname: string) =>
    Object.values(ROUTE_DEFINITIONS).some(
        (r) => r.chromeless && r.path === pathname
    )

const AppShell = () => {
    const { pathname } = useLocation()
    const chromeless = isChromelessRoute(pathname)

    return (
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
            <DesktopWidgets enabled={false} />
            {chromeless ? (
                <Pages />
            ) : (
                <PageContainer>
                    <NavigationBar />
                    <Pages />
                </PageContainer>
            )}
        </ErrorBoundary>
    )
}

const App = () => {
    return (
        <Providers>
            <AppShell />
            <Toaster position="bottom-center" />
        </Providers>
    )
}

export default App
