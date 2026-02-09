import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persistOptions } from '@/lib/queryClient'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/providers/ThemeProvider'
import ContentProvider from '@/providers/ContentProvider'

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
            <ThemeProvider>
                <BrowserRouter>
                    <ContentProvider>
                        {children}
                    </ContentProvider>
                </BrowserRouter>
            </ThemeProvider>
        </PersistQueryClientProvider>
    )
}

export default Providers;