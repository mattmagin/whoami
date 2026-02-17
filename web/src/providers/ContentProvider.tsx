import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import { useResume, type ResumeData } from '@/hooks/queries'
import { ROUTE_DEFINITIONS } from '@/consts'
import strings from '@/content/strings.json'

export type Strings = typeof strings

type ContentContextType = Strings & {
    resume?: ResumeData;
    resumeLoading: boolean;
    resumeError: boolean;
    /** Page heading shown in the persistent header. False = no header. */
    heading: string | false;
    /** Page subheading shown below the heading. */
    subheading: string;
    /** Override the route-derived heading/subheading (e.g. Resume sets API data). */
    setPageHeader: (heading: string | false, subheading?: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

/**
 * Derive the default heading/subheading from the current route's
 * `headerContentSection` key in strings.json.
 */
const deriveRouteHeader = (pathname: string): { heading: string | false; subheading: string } => {
    for (const def of Object.values(ROUTE_DEFINITIONS)) {
        if (def.headerContentSection && matchPath(def.path, pathname)) {
            const section = strings[def.headerContentSection] as { title?: string; description?: string } | undefined
            return {
                heading: section?.title ?? false,
                subheading: section?.description ?? '',
            }
        }
    }
    return { heading: false, subheading: '' }
}

const ContentProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: resume, isLoading: resumeLoading, isError: resumeError } = useResume()
    const { pathname } = useLocation()

    // Route-derived defaults
    const routeHeader = deriveRouteHeader(pathname)

    // Override state — set by pages that need custom headings (e.g. Resume)
    const [override, setOverride] = useState<{ heading: string | false; subheading: string } | null>(null)

    // Clear overrides when the route changes
    useEffect(() => {
        setOverride(null)
    }, [pathname])

    const setPageHeader = useCallback((heading: string | false, subheading?: string) => {
        setOverride({ heading, subheading: subheading ?? '' })
    }, [])

    const heading = override?.heading ?? routeHeader.heading
    const subheading = override?.subheading ?? routeHeader.subheading

    const value: ContentContextType = {
        ...strings,
        resume, //TODO: fix later
        resumeLoading,
        resumeError,
        heading,
        subheading,
        setPageHeader,
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
