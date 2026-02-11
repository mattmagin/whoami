import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ROUTE_DEFINITIONS } from '@/consts'
import NotFound from './NotFound'

const Pages: React.FC = () => {
  return (
    <Suspense>
      <Routes>
        {Object.values(ROUTE_DEFINITIONS).map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default Pages
