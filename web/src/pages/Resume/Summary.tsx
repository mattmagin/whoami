import { Text, Stack } from '@/components/ui'

interface SummaryProps {
    summary: string | null
}

const Summary = ({ summary }: SummaryProps) => {
    return (
        <Stack as="section" gap="lg">
            <Text variant="sectionTitle">
                Summary
            </Text>
            <Text variant="body">
                {summary}
            </Text>
        </Stack>
    )
}

export default Summary
