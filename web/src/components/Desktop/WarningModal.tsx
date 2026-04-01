import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

const WarningModal = () => {
  const controls = useAnimation()
  const [clicking, setClicking] = useState(false)

  const handleClose = async () => {
    if (clicking) return
    setClicking(true)
    await controls.start({
      x: [0, -8, 8, -8, 8, 0],
      transition: { duration: 0.4, ease: 'easeInOut' },
    })
    setClicking(false)
  }

  return (
    <motion.div animate={controls} style={{ width: 280 }}>
      {/* Title bar */}
      <div
        style={{
          background: '#000',
          color: '#fff',
          fontFamily: "'JetBrains Mono Variable', monospace",
          fontSize: 13,
          fontWeight: 700,
          padding: '6px 10px',
          letterSpacing: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>SYSTEM ALERT</span>
        <span style={{ fontSize: 11, opacity: 0.6 }}>&#x2715;</span>
      </div>

      {/* Body */}
      <div
        style={{
          background: '#00FFFF',
          padding: '20px 16px',
          fontFamily: "'DM Sans Variable', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: '#000',
          lineHeight: 1.4,
        }}
      >
        <p style={{ margin: '0 0 18px 0' }}>
          Warning: High Levels of Creativity Detected.
        </p>

        <button
          onClick={handleClose}
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '8px 24px',
            background: '#fff',
            border: '3px solid #000',
            boxShadow: '3px 3px 0px 0px #000',
            fontFamily: "'JetBrains Mono Variable', monospace",
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.5,
          }}
        >
          CLOSE
        </button>
      </div>
    </motion.div>
  )
}

export default WarningModal
