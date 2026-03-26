import { TypeAnimation } from 'react-type-animation'

interface Sequence {
  text: string
  style?: React.CSSProperties
}

interface TypewriterTextProps {
  pauseAfterText?: number
  pauseAfterDelete?: number
  className?: string
  sequence: Sequence[]
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ sequence, className, pauseAfterText = 2000, pauseAfterDelete = 500 }) => {
  const composedSequence = sequence.flatMap(({ text, style }) =>
    [text, pauseAfterText, '', pauseAfterDelete]
  );

  return (
    <TypeAnimation
      sequence={composedSequence}
      wrapper="span"
      speed={50}
      deletionSpeed={70}
      repeat={Infinity}
      className={className}
      cursor={true}
    />
  )
}

export default TypewriterText
