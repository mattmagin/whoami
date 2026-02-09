import { createContext, useContext } from 'react'
import { useResume, type ResumeData } from '@/hooks/queries'
import strings from '@/content/strings.json'

export type Strings = typeof strings

type ContentContextType = Strings & {
    resume?: ResumeData;
    resumeLoading: boolean;
    resumeError: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

const ContentProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: resume, isLoading: resumeLoading, isError: resumeError } = useResume()

    const value: ContentContextType = {
        ...strings,
        resume, //TODO: fix later
        resumeLoading,
        resumeError,
    }

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    )
}

export const useContent = () => {
    return useContext(ContentContext)
}

export default ContentProvider