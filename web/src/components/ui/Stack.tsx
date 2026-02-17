import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import {
    type GapSize,
    type AlignItems,
    type LayoutElement,
    gapValues,
    alignValues,
} from './layout.types'

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
    /** Vertical gap between children */
    gap?: GapSize
    /** Horizontal alignment of children */
    align?: AlignItems
    /** HTML element to render as */
    as?: LayoutElement
    children: React.ReactNode
}

interface StyledProps {
    $gap: GapSize
    $align: AlignItems
}

const baseStyles = css`
    display: flex;
    flex-direction: column;
`

const StyledDiv = styled.div<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledSection = styled.section<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledArticle = styled.article<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledHeader = styled.header<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledFooter = styled.footer<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledMain = styled.main<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledAside = styled.aside<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledNav = styled.nav<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledUl = styled.ul<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
    list-style: none;
    margin: 0;
    padding: 0;
`

const StyledOl = styled.ol<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
    list-style: none;
    margin: 0;
    padding: 0;
`

const StyledForm = styled.form<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledSpan = styled.span<StyledProps>`
    ${baseStyles}
    gap: ${({ $gap }) => gapValues[$gap]};
    align-items: ${({ $align }) => alignValues[$align]};
`

const StyledElements = {
    div: StyledDiv,
    section: StyledSection,
    article: StyledArticle,
    header: StyledHeader,
    footer: StyledFooter,
    main: StyledMain,
    aside: StyledAside,
    nav: StyledNav,
    ul: StyledUl,
    ol: StyledOl,
    form: StyledForm,
    span: StyledSpan,
}

const Stack = React.forwardRef<HTMLElement, StackProps>(
    ({ gap = 'md', align = 'stretch', as = 'div', className, children, ...props }, ref) => {
        const StyledComponent = StyledElements[as]

        return (
            <StyledComponent
                ref={ref as React.Ref<never>}
                className={className}
                $gap={gap}
                $align={align}
                data-slot="stack"
                {...props}
            >
                {children}
            </StyledComponent>
        )
    }
)
Stack.displayName = 'Stack'

export default Stack
