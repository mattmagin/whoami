import { Text, Stack, Flex } from '@/components/ui'
import type { ResumeEducation } from '@/types'

interface EducationProps {
    education: ResumeEducation[]
}

const Education = ({ education }: EducationProps) => {
    return (
        <Stack as="section" gap="lg">
            <Text variant="sectionTitle">
                Education
            </Text>
            <Stack gap="lg">
                {education.map((edu) => (
                    <Stack key={edu.institution} gap="sm">
                        <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary/50">
                            <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                        </div>
                        <Flex direction="col" gap="xs" className="sm:flex-row sm:items-baseline sm:justify-between pl-6">
                            <Text variant="muted" as="p">
                                {edu.institution} • {edu.location}
                            </Text>
                            <Text variant="bodySmall" as="span">{edu.dates}</Text>
                        </Flex>
                        {edu.details && edu.details.length > 0 && (
                            <Stack as="ul" gap="xs" className="pl-6">
                                {edu.details.map((detail, i) => (
                                    <Text key={i} variant="bodySmall" as="li" className="before:mr-2 before:content-['•']">
                                        {detail}
                                    </Text>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                ))}
            </Stack>
        </Stack>
    )
}

export default Education
