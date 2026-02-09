import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Resume from './Resume'
import Blog from './Blog'
import BlogPost from './BlogPost'
import Projects from './Projects'
import Contact from './Contact'

interface Route {
  path: string
  Element: React.ElementType
}

const ROUTES: Record<string, Route> = {
  HOME: { path: '/', Element: Home },
  RESUME: { path: '/resume', Element: Resume },
  BLOG: { path: '/blog', Element: Blog },
  BLOG_POST: { path: '/blog/:slug', Element: BlogPost },
  PROJECTS: { path: '/projects', Element: Projects },
  CONTACT: { path: '/contact', Element: Contact },
} as const;

const Pages: React.FC = () => {
  return (
    <Routes>
      {Object.values(ROUTES).map(({ path, Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}
    </Routes>
  )
}

export default Pages;