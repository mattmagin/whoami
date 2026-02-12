import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, Text, Stack, Flex } from '@/components/ui'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import SshCommand from '@/components/SshCommand'
import TypewriterText from '@/components/TypewriterText'
import { useContent } from '@/providers/ContentProvider'
import { useResume } from '@/hooks/queries'

const useModifierKey = () =>
    useMemo(() => {
        if (typeof navigator === 'undefined') return '⌘'
        return /mac|iphone|ipad|ipod/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'
    }, [])

const HeroSection = () => {
    const { common, home } = useContent()
    const { data: resume } = useResume()
    const modKey = useModifierKey()

    return (
        <Stack as="section" gap="md" className="mb-20">
            <p className="text-sm font-medium text-primary animate-fade-in">
                {home.greeting}
            </p>
            <Text variant="pageTitle" className="animate-slide-up">
                {resume?.name.split(" ")[0]}
            </Text>
            <div className="h-8 text-xl text-primary md:text-2xl animate-slide-up-delay-1">
                <TypewriterText />
            </div>
            <Text variant="body" className="max-w-2xl md:text-xl animate-slide-up-delay-2">
                {resume?.summary}
            </Text>
            <Flex gap="md" wrap className="animate-slide-up-delay-3">
                <Button asChild size="lg">
                    <Link to="/projects">
                        {home.viewWork}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link to="/contact">{common.getInTouch}</Link>
                </Button>
            </Flex>

            {/* SSH Access Hint with tooltip */}
            <SshCommand showHint showTooltip className="mt-8 inline-flex animate-slide-up-delay-3" />

            {/* Command palette hint */}
            <p className="text-xs text-muted-foreground animate-slide-up-delay-3">
                Press <KbdGroup><Kbd>{modKey}</Kbd><Kbd>K</Kbd></KbdGroup> for quick navigation
            </p>
        </Stack>
    )
}

export default HeroSection
