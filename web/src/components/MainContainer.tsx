import type { ReactNode } from 'react'
import Header from './layout/Header'
import Footer from './layout/Footer'

interface MainContainerProps {
  children: ReactNode
}

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainContainer
