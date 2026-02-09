import { Text, Stack, Flex } from '@/components/ui'
import type { ResumeExperience } from '@/types'

interface ExperienceProps {
    experience: ResumeExperience[]
}

const Experience = ({ experience }: ExperienceProps) => {
    return (
        <Stack as="section" gap="lg">
            <Text variant="sectionTitle">
                Experience
            </Text>
            <Stack gap="xl">
                {experience.map((exp) => (
                    <Stack key={`${exp.company}-${exp.title}`} gap="sm">
                        <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary/50">
                            <h3 className="font-semibold text-foreground">{exp.title}</h3>
                        </div>
                        <Flex direction="col" gap="xs" className="sm:flex-row sm:items-baseline sm:justify-between pl-6">
                            <Text variant="muted" as="p">
                                {exp.company} • {exp.location}
                            </Text>
                            <Text variant="bodySmall" as="span">{exp.dates}</Text>
                        </Flex>
                        <Stack as="ul" gap="xs" className="pl-6">
                            {exp.highlights.map((highlight, i) => (
                                <Text key={i} variant="bodySmall" as="li" className="before:mr-2 before:content-['•']">
                                    {highlight}
                                </Text>
                            ))}
                        </Stack>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    )
}

export default Experience
