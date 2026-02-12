import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persistOptions, checkContentVersion } from '@/lib/queryClient'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import ContentProvider from '@/providers/ContentProvider'

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={persistOptions}
            onSuccess={checkContentVersion}
        >
            <ThemeProvider>
                <TooltipProvider>
                    <BrowserRouter>
                        <ContentProvider>
                            {children}
                        </ContentProvider>
                    </BrowserRouter>
                </TooltipProvider>
            </ThemeProvider>
        </PersistQueryClientProvider>
    )
}

export default Providers;