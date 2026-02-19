import { createContext, useContext } from 'react'
import type { ResumeData } from '@/api'

export type ContentContextType = {
    resume?: ResumeData;
    resumeLoading: boolean;
    resumeError: boolean;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined)

export const useContent = () => {
    return useContext(ContentContext)
}
