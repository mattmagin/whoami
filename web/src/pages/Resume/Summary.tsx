import { Text, Stack } from '@/components/ui'

interface SummaryProps {
    summary: string
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
