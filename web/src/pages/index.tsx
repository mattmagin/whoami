import { Routes, Route } from 'react-router-dom'
import { ROUTE, ROUTE_DEFINITIONS } from '@/consts'
import Home from './Home'
import Resume from './Resume'
import Blog from './Blog'
import BlogPost from './BlogPost'
import Projects from './Projects'
import Contact from './Contact'

/** Map route keys to their page components (kept local — components aren't consts) */
const ROUTE_COMPONENTS: Partial<Record<string, React.ElementType>> = {
  [ROUTE.HOME]: Home,
  [ROUTE.RESUME]: Resume,
  [ROUTE.BLOG]: Blog,
  [ROUTE.BLOG_POST]: BlogPost,
  [ROUTE.PROJECTS]: Projects,
  [ROUTE.CONTACT]: Contact,
}

const Pages: React.FC = () => {
  return (
    <Routes>
      {Object.entries(ROUTE_DEFINITIONS).map(([key, { path }]) => {
        const Element = ROUTE_COMPONENTS[key]
        if (!Element) return null
        return <Route key={path} path={path} element={<Element />} />
      })}
    </Routes>
  )
}

export default Pages
