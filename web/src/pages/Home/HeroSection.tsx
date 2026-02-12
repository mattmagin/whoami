import { Text, Stack } from '@/components/ui'
import TerminalCard from '@/components/TerminalCard'
import TypewriterText from '@/components/TypewriterText'
import { useContent } from '@/providers/ContentProvider'
import { useResume } from '@/hooks/queries'

const HeroSection = () => {
    const { home } = useContent()
    const { data: resume } = useResume()

    return (
        <Stack as="section" gap="md">
            <p className="text-base font-medium text-primary md:text-lg lg:text-xl animate-fade-in">
                {home.greeting}
            </p>
            <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] animate-slide-up">
                {resume?.name}
            </h1>
            <div className="h-10 text-xl text-primary md:text-2xl lg:text-3xl animate-slide-up-delay-1">
                <TypewriterText />
            </div>
            <Text variant="body" className="max-w-2xl md:text-xl animate-slide-up-delay-2">
                {resume?.summary}
            </Text>

            {/* Terminal mock with SSH command */}
            <TerminalCard className="mt-8 animate-slide-up-delay-3" />
        </Stack>
    )
}

export default HeroSection
