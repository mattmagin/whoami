import { type CSSProperties, type ReactNode, type RefObject } from 'react'
import { motion } from 'framer-motion'

interface DraggableWidgetProps {
  children: ReactNode
  initialX: number
  initialY: number
  rotate?: number
  style?: CSSProperties
  constraintsRef: RefObject<HTMLDivElement | null>
}

const DraggableWidget = ({
  children,
  initialX,
  initialY,
  rotate = 0,
  style,
  constraintsRef,
}: DraggableWidgetProps) => (
  <motion.div
    drag
    dragConstraints={constraintsRef}
    dragMomentum={false}
    whileDrag={{ scale: 1.05, zIndex: 50 }}
    initial={{ x: initialX, y: initialY, rotate }}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      cursor: 'grab',
      zIndex: 1,
      border: '3px solid #000',
      boxShadow: '4px 4px 0px 0px #000',
      userSelect: 'none',
      ...style,
    }}
  >
    {children}
  </motion.div>
)

export default DraggableWidget
