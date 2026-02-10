import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Terminal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Text, Stack, Flex } from '@/components/ui'
import CopyButton from '@/components/CopyButton'
import TypewriterText from '@/components/TypewriterText'
import { useContent } from '@/providers/ContentProvider'
import { useResume } from '@/hooks/queries'

const useModifierKey = () =>
    useMemo(() => {
        if (typeof navigator === 'undefined') return '⌘'
        return /mac|iphone|ipad|ipod/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'
    }, [])

const HeroSection = () => {
    const { common, home, tuiEntry } = useContent()
    const { data: resume } = useResume()
    const [sshHovered, setSshHovered] = useState(false)
    const modKey = useModifierKey()

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

            {/* SSH Access Hint with tooltip */}
            <div
                className="relative inline-block animate-slide-up-delay-3"
                onMouseEnter={() => setSshHovered(true)}
                onMouseLeave={() => setSshHovered(false)}
            >
                <Flex align="center" gap="xs" className="mt-8 inline-flex rounded-lg bg-muted/50 pl-4 pr-1 py-1 font-mono text-sm text-muted-foreground cursor-default">
                    <Terminal className="h-4 w-4" />
                    <span>{home.sshHint} {common.sshCommand}</span>
                    <CopyButton text={common.sshCommand} className="h-8 w-8" />
                </Flex>

                <AnimatePresence>
                    {sshHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg whitespace-nowrap"
                        >
                            {tuiEntry.hoverHint}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-primary" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Command palette hint */}
            <p className="text-xs text-muted-foreground animate-slide-up-delay-3">
                Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">{modKey}+K</kbd> for quick navigation
            </p>
        </Stack>
    )
}

export default HeroSection
