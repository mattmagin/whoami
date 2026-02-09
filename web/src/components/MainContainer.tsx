import type { ReactNode } from 'react'
import { Flex } from '@/components/ui'
import Header from './layout/Header'
import Footer from './layout/Footer'

interface MainContainerProps {
  children: ReactNode
}

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <Flex direction="col" className="min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </Flex>
  )
}

export default MainContainer
