import PageHeading, { type PageHeadingProps } from "../Text/PageHeading"
import { Text } from "@/components/ui"

export type HeaderText = Partial<PageHeadingProps> | string
export type HeaderActions = React.ReactNode | React.ReactNode[]

interface HeaderTextProps {
    heading: HeaderText
}

const HeaderText: React.FC<HeaderTextProps> = ({ heading }) => {
    if (typeof heading === 'string') return <PageHeading text={heading} />
    if (heading.text || heading.styledText) return <PageHeading text={heading.text} styledText={heading.styledText} />

    return null;
}

interface PageContainerHeaderProps {
    headerText?: HeaderText
    headerActions?: HeaderActions
    bodyText?: string
}



const PageContainerHeader = ({ headerText, headerActions, bodyText }: PageContainerHeaderProps) => {
    return (
        <div className="mb-8 gap-8 flex flex-col">
            <div className="flex justify-between items-center">
                {headerText && <HeaderText heading={headerText} />}
                {headerActions && <div className="flex gap-2 justify-end">{headerActions}</div>}
            </div>
            {bodyText && <Text variant="body">{bodyText}</Text>}
        </div>
    )
}

export default PageContainerHeader