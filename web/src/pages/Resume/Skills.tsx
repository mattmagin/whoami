import { Badge, Text, Stack, Flex, Grid } from '@/components/ui'

interface SkillsProps {
    skills: Record<string, string[]>
}

const Skills = ({ skills }: SkillsProps) => {
    return (
        <Stack as="section" gap="lg">
            <Text variant="sectionTitle">
                Skills
            </Text>
            <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="lg">
                {Object.entries(skills).map(([category, categorySkills]) => (
                    <Stack key={category} gap="sm">
                        <Text variant="label" as="h3">
                            {category}
                        </Text>
                        <Flex gap="xs" wrap>
                            {categorySkills.map((skill) => (
                                <Badge key={skill} variant="outline" className="font-mono text-xs">
                                    {skill}
                                </Badge>
                            ))}
                        </Flex>
                    </Stack>
                ))}
            </Grid>
        </Stack>
    )
}

export default Skills
