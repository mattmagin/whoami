import { useLocation } from 'react-router-dom'
import { ROUTE, ROUTE_DEFINITIONS, type RouteDefinition } from '@/consts'

const useCurrentRoute = (): RouteDefinition => {
    const location = useLocation()
    const pathname = location.pathname
    return Object.values(ROUTE_DEFINITIONS).find((route) => route.path === pathname) ?? ROUTE_DEFINITIONS[ROUTE.HOME]
}

export default useCurrentRoute;