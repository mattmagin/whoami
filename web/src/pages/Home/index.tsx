import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from './HeroSection'
import SideNav from './SideNav'

const EXIT_DURATION = 400

const Home = () => {
  const navigate = useNavigate()
  const [exiting, setExiting] = useState(false)
  const pendingPath = useRef<string | null>(null)

  const handleNavigate = useCallback(
    (path: string) => {
      if (exiting) return
      pendingPath.current = path
      setExiting(true)
      setTimeout(() => {
        navigate(path)
      }, EXIT_DURATION)
    },
    [exiting, navigate],
  )

  const handleBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  return (
    <div
      className={`flex h-screen w-screen items-center overflow-hidden px-6 md:px-10 lg:px-16 ${
        exiting ? 'animate-slide-down' : ''
      }`}
    >
      <div className="flex w-full max-w-6xl mx-auto items-center justify-between gap-12">
        <HeroSection />
        <SideNav onNavigate={handleNavigate} onBack={handleBack} />
      </div>
    </div>
  )
}

export default Home
