import { useState, useEffect } from 'react'

const SIZE = 160
const CENTER = SIZE / 2
const TICK_OUTER = 72
const TICK_INNER_HOUR = 60
const TICK_INNER_MIN = 66

const AnalogClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours() % 12

  const secondAngle = seconds * 6
  const minuteAngle = minutes * 6 + seconds * 0.1
  const hourAngle = hours * 30 + minutes * 0.5

  const handCoords = (angle: number, length: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return {
      x: CENTER + length * Math.cos(rad),
      y: CENTER + length * Math.sin(rad),
    }
  }

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30
    const isHour = true
    const outer = handCoords(angle, TICK_OUTER)
    const inner = handCoords(angle, isHour ? TICK_INNER_HOUR : TICK_INNER_MIN)
    return { outer, inner, isHour }
  })

  const hourEnd = handCoords(hourAngle, 38)
  const minuteEnd = handCoords(minuteAngle, 52)
  const secondEnd = handCoords(secondAngle, 58)

  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: '50%',
        background: '#FFFF00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.inner.x}
            y1={t.inner.y}
            x2={t.outer.x}
            y2={t.outer.y}
            stroke="#000"
            strokeWidth={i % 3 === 0 ? 3 : 1.5}
            strokeLinecap="round"
          />
        ))}

        {/* Hour hand */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={hourEnd.x}
          y2={hourEnd.y}
          stroke="#000"
          strokeWidth={5}
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={minuteEnd.x}
          y2={minuteEnd.y}
          stroke="#000"
          strokeWidth={3.5}
          strokeLinecap="round"
        />

        {/* Second hand */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={secondEnd.x}
          y2={secondEnd.y}
          stroke="#000"
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={CENTER} cy={CENTER} r={4} fill="#000" />
      </svg>
    </div>
  )
}

export default AnalogClock
