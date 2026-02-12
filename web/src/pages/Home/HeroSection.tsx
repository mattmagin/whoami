import { Text, Stack } from '@/components/ui'
import { Kbd } from '@/components/ui/kbd'
import TerminalCard from '@/components/TerminalCard'
import TypewriterText from '@/components/TypewriterText'
import { useContent } from '@/providers/ContentProvider'
import { useResume } from '@/hooks/queries'

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
const modKey = isMac ? '⌘' : 'Ctrl'

const HeroSection = () => {
    const { home, keyboardGuide } = useContent()
    const { data: resume } = useResume()

    const shortcuts = [
        { keys: ['j', 'k'], label: keyboardGuide.navigate },
        { keys: ['l'], label: keyboardGuide.select },
        { keys: [`${modKey}+K`], label: keyboardGuide.commandPalette },
    ]

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

            {/* Keyboard shortcut guide */}
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 max-w-sm animate-slide-up-delay-3">
                {shortcuts.map(({ keys, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                            {keys.map((k, i) => (
                                <span key={k} className="flex items-center gap-1">
                                    {i > 0 && <span className="text-muted-foreground/40 text-xs">/</span>}
                                    <Kbd>{k}</Kbd>
                                </span>
                            ))}
                        </span>
                        <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                ))}
            </div>
        </Stack>
    )
}

export default HeroSection
