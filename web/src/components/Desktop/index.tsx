import { useRef, useState, useEffect } from 'react'
import DraggableWidget from './DraggableWidget'
import AnalogClock from './AnalogClock'
import PostItNote from './PostItNote'
import WarningModal from './WarningModal'

const MIN_WIDTH = 1400

const useIsWideViewport = () => {
  const [isWide, setIsWide] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= MIN_WIDTH,
  )

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`)
    const onChange = (e: MediaQueryListEvent) => setIsWide(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isWide
}

interface DesktopWidgetsProps {
  enabled?: boolean
}

const DesktopWidgets = ({ enabled = true }: DesktopWidgetsProps) => {
  const isWide = useIsWideViewport()
  const containerRef = useRef<HTMLDivElement>(null)

  if (!enabled || !isWide) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Each widget re-enables pointer events on itself */}
      <DraggableWidget
        constraintsRef={containerRef}
        initialX={window.innerWidth * 0.03}
        initialY={window.innerHeight * 0.2}
        style={{ pointerEvents: 'auto', borderRadius: '50%' }}
      >
        <AnalogClock />
      </DraggableWidget>

      <DraggableWidget
        constraintsRef={containerRef}
        initialX={window.innerWidth * 0.05}
        initialY={window.innerHeight * 0.65}
        rotate={-3}
        style={{ pointerEvents: 'auto' }}
      >
        <PostItNote />
      </DraggableWidget>

      <DraggableWidget
        constraintsRef={containerRef}
        initialX={window.innerWidth * 0.85}
        initialY={window.innerHeight * 0.3}
        style={{ pointerEvents: 'auto' }}
      >
        <WarningModal />
      </DraggableWidget>
    </div>
  )
}

export default DesktopWidgets
