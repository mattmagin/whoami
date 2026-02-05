import { TypeAnimation } from 'react-type-animation'

interface TypewriterTextProps {
  className?: string
}

export function TypewriterText({ className }: TypewriterTextProps) {
  return (
    <TypeAnimation
      sequence={[
        'Full-Stack Engineer',
        2000, // pause 2s
        '',
        500,  // brief pause after delete
        'Powered By Coffee',
        2000,
        '',
        500,
        'Tinkerer at Heart',
        2000,
        '',
        500,
        'Open Source Enthusiast',
        2000,
        '',
        500,
      ]}
      wrapper="span"
      speed={50}
      deletionSpeed={70}
      repeat={Infinity}
      className={className}
      cursor={true}
    />
  )
}
