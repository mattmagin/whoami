import { useResume } from '@/hooks/queries'
import { ContentContext, type ContentContextType } from './contentContext'

const ContentProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: resume, isLoading: resumeLoading, isError: resumeError } = useResume()

    const value: ContentContextType = {
        resume,
        resumeLoading,
        resumeError,
    }

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    )
}

export default ContentProvider
