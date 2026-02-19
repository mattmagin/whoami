import { TypeAnimation } from 'react-type-animation'

const TYPEWRITER_STRINGS = [
  'Software Engineer',
  'Powered By Coffee',
  'Tinkerer and Maker at Heart',
  'Homelabber',
  'Open Source Enthusiast',
]

interface TypewriterTextProps {
  pauseAfterText?: number
  pauseAfterDelete?: number
  className?: string

}

const TypewriterText = ({ className, pauseAfterText = 2000, pauseAfterDelete = 500 }: TypewriterTextProps) => {
  const sequence = TYPEWRITER_STRINGS.flatMap((text) =>
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
