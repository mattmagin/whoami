import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, Text, Stack, Flex } from '@/components/ui'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import SshCommand from '@/components/SshCommand'
import TypewriterText from '@/components/TypewriterText'
import { useResume } from '@/hooks/queries'

const useModifierKey = () =>
    useMemo(() => {
        if (typeof navigator === 'undefined') return 'Ctrl'
        return /mac|iphone|ipad|ipod/i.test(navigator.userAgent) ? 'Cmd' : 'Ctrl'
    }, [])

const HeroSection = () => {
    const { data: resume } = useResume()
    const modKey = useModifierKey()

    return (
        <Stack as="section" gap="lg" align="center" className="text-center">
            <p className="text-base md:text-lg font-medium text-primary animate-fade-in">
                Hey, I'm
            </p>
            <Text variant="pageTitle" className="!text-4xl md:!text-5xl lg:!text-6xl 2xl:!text-7xl animate-slide-up">
                {resume?.name}
            </Text>
            <div className="h-10 text-xl text-primary md:text-2xl 2xl:text-3xl animate-slide-up-delay-1">
                <TypewriterText />
            </div>
            <Text variant="body" className="max-w-2xl text-center lg:text-xl animate-slide-up-delay-2">
                {resume?.summary}
            </Text>
            <Flex gap="md" wrap justify="center" className="animate-slide-up-delay-3">
                <Button asChild size="lg">
                    <Link to="/resume">
                        Resume
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link to="/projects">Projects</Link>
                </Button>
            </Flex>

            {/* SSH Access Hint with tooltip */}
            <SshCommand showHint showTooltip className="mt-8 inline-flex animate-slide-up-delay-3" />

            {/* Command palette hint */}
            <p className="text-sm text-muted-foreground animate-slide-up-delay-3">
                Press <KbdGroup><Kbd>{modKey}</Kbd><Kbd>K</Kbd></KbdGroup> for quick navigation
            </p>
        </Stack>
    )
}

export default HeroSection
