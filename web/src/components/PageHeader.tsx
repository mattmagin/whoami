import { Text, Stack } from '@/components/ui'

interface PageHeaderProps {
    /** Target heading text, or false when no header should show. */
    title: string | false
    description: string
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
    if (!title) {
        return null
    }

    return (
        <div className="shrink-0 pb-6">
            <Stack as="header" gap="sm">
                <Text variant="pageTitle">{title}</Text>
                {description && (
                    <Text variant="body">{description}</Text>
                )}
            </Stack>
        </div>
    )
}

export default PageHeader
