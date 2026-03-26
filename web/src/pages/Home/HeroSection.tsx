import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, Text, Stack, Flex } from '@/components/ui'
import SshCommand from '@/components/SshCommand'
import TypewriterText from '@/components/TypewriterText'
import { useResume } from '@/hooks/queries'

const HeroSection = () => {
    const { data: resume } = useResume()

    return (
        <Stack as="section" gap="lg" align="center" className="text-center">
            <p className="text-base md:text-lg font-medium text-primary">
                Hey, I'm
            </p>
            <Text variant="pageTitle" className="!text-4xl md:!text-5xl lg:!text-6xl 2xl:!text-7xl">
                {resume?.name}
            </Text>
            <div className="h-10 text-xl text-primary md:text-2xl 2xl:text-3xl">
                <TypewriterText />
            </div>
            <Text variant="body" className="max-w-2xl text-center lg:text-xl">
                {resume?.summary}
            </Text>
            <Flex gap="md" wrap justify="center">
                <Button asChild size="lg">
                    <Link to="/resume">
                        Resume
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                    <Link to="/projects">Projects</Link>
                </Button>
            </Flex>

            {/* SSH Access Hint with tooltip */}
            <SshCommand showHint showTooltip className="mt-8 inline-flex" />
        </Stack>
    )
}

export default HeroSection
