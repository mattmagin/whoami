import { TypeAnimation } from 'react-type-animation'
import strings from '@/content/strings.json'

interface TypewriterTextProps {
  pauseAfterText?: number
  pauseAfterDelete?: number
  className?: string

}

const TypewriterText = ({ className, pauseAfterText = 2000, pauseAfterDelete = 500 }: TypewriterTextProps) => {
  const sequence = strings.typewriter.flatMap((text) =>
    [text, pauseAfterText, '', pauseAfterDelete]
  );

  return (
    <TypeAnimation
      sequence={sequence}
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
