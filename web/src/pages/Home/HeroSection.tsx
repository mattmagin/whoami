import { Link } from 'react-router-dom'
import { ArrowRight, Terminal } from 'lucide-react'
import { Button, Text, Stack, Flex } from '@/components/ui'
import CopyButton from '@/components/CopyButton'
import TypewriterText from '@/components/TypewriterText'
import { useContent } from '@/providers/ContentProvider'
import { useResume } from '@/hooks/queries'

const HeroSection = () => {
    const { common, home } = useContent()
    const { data: resume } = useResume()

    return (
        <Stack as="section" gap="md" className="mb-20">
            <p className="text-sm font-medium text-primary animate-fade-in">
                {home.greeting}
            </p>
            <Text variant="pageTitle" className="animate-slide-up">
                {resume?.name}
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

            {/* SSH Access Hint */}
            <Flex align="center" gap="xs" className="mt-8 inline-flex rounded-lg bg-muted/50 pl-4 pr-1 py-1 font-mono text-sm text-muted-foreground animate-slide-up-delay-3">
                <Terminal className="h-4 w-4" />
                <span>{home.sshHint} {common.sshCommand}</span>
                <CopyButton text={common.sshCommand} className="h-8 w-8" />
            </Flex>
        </Stack>
    )
}

export default HeroSection
