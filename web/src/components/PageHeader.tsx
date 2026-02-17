import { Text, Stack } from '@/components/ui'
import { usePageTypewriter } from '@/hooks/useTypewriter'

interface PageHeaderProps {
    /** Target heading text, or false when no header should show. */
    title: string | false
    description: string
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
    const headingTarget = title || ''
    const subheadingTarget = title ? description : ''

    const { heading, subheading, isAnimating, headingActive } = usePageTypewriter(headingTarget, subheadingTarget)

    // Render nothing when fully empty and not mid-animation
    if (!heading && !subheading && !isAnimating) {
        return null
    }

    return (
        <div className="shrink-0 pb-6">
            <Stack as="header" gap="sm">
                <Text variant="pageTitle">
                    {heading}
                    {headingActive && <span className="animate-pulse ml-[1px]">|</span>}
                </Text>
                {subheading && (
                    <Text variant="body">{subheading}</Text>
                )}
            </Stack>
        </div>
    )
}

export default PageHeader
