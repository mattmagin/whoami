import { useLocation, matchPath } from 'react-router-dom'
import { ROUTE_DEFINITIONS, type PostType } from '@/consts'

/**
 * Returns the `postType` discriminator for the current route by matching
 * the location against ROUTE_DEFINITIONS. Returns `undefined` if the
 * active route has no `postType` set.
 */
const usePostType = (): PostType | undefined => {
    const { pathname } = useLocation()

    for (const def of Object.values(ROUTE_DEFINITIONS)) {
        if (def.postType && matchPath(def.path, pathname)) {
            return def.postType
        }
    }

    return undefined
}

export default usePostType
