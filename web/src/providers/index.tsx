import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persistOptions } from '@/lib/queryClient'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/ThemeContext'

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
            <ThemeProvider>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </ThemeProvider>
        </PersistQueryClientProvider>
    )
}

export default Providers;