import styled from "@emotion/styled"
import { Theme } from "../theme"
import BaseText from "../ui/Text"

export interface PageHeadingProps {
    text?: string
    styledText?: React.ReactNode
}

const Text = styled(BaseText)`
    color: ${Theme.colors.dark.black};
    font-size: 3rem !important;

    ::selection {
        background-color: #ffcc00;
        color: #000;
    }
    
    @media (max-width: 1200px) {
        font-size: 2.5rem !important;
    }
        
    .underline {
        text-decoration: underline;
        text-decoration-color: ${Theme.colors.light.blue};
        text-decoration-thickness: 6px;
        text-underline-offset: 4px;
    
        ::selection {
        background-color: #ffcc00;
        // background-color: ${Theme.colors.light.blue};
        color: #000;
        }
    }
`

const PageHeading = ({ text, styledText }: PageHeadingProps) => {
    return <Text variant="sectionTitle">
        {text} {styledText && <span className="underline">{styledText}</span>}
    </Text>
}

export default PageHeading