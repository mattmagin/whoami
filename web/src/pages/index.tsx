import { Routes, Route } from 'react-router-dom'
import { ROUTE_DEFINITIONS } from '@/consts'
import NotFound from './NotFound'

const Pages: React.FC = () => {
  return (
    <Routes>
<<<<<<< HEAD
      {Object.values(ROUTE_DEFINITIONS)
        .filter((r): r is typeof r & { component: React.ComponentType } => !!r.component)
        .map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
=======
      {Object.values(ROUTE_DEFINITIONS).map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
>>>>>>> 2181ca3c (Small fixes)
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Pages
