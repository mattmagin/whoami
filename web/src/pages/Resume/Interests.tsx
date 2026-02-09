import { Text, Stack } from '@/components/ui'

interface InterestsProps {
    interests: string[]
}

const Interests = ({ interests }: InterestsProps) => {
    return (
        <Stack as="section" gap="lg">
            <Text variant="sectionTitle">
                Interests
            </Text>
            <Text variant="muted">
                {interests.join(' • ')}
            </Text>
        </Stack>
    )
}

export default Interests
