import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import {
    type GapSize,
    type AlignItems,
    type JustifyContent,
    type FlexDirection,
    type LayoutElement,
    gapValues,
    alignValues,
    justifyValues,
} from './layout.types'

export interface FlexProps extends React.HTMLAttributes<HTMLElement> {
    /** Gap between children */
    gap?: GapSize
    /** Alignment of children (align-items) */
    align?: AlignItems
    /** Justification of children (justify-content) */
    justify?: JustifyContent
    /** Flex direction */
    direction?: FlexDirection
    /** Whether to wrap children */
    wrap?: boolean
    /** HTML element to render as */
    as?: LayoutElement
    children: React.ReactNode
}

interface StyledProps {
    $gap: GapSize
    $align: AlignItems
    $justify: JustifyContent
    $direction: FlexDirection
    $wrap: boolean
}

const baseStyles = css`
    display: flex;
`

const getFlexStyles = (props: StyledProps) => css`
    ${baseStyles}
    gap: ${gapValues[props.$gap]};
    align-items: ${alignValues[props.$align]};
    justify-content: ${justifyValues[props.$justify]};
    flex-direction: ${props.$direction === 'col' ? 'column' : 'row'};
    flex-wrap: ${props.$wrap ? 'wrap' : 'nowrap'};
`

const StyledDiv = styled.div<StyledProps>`
    ${(props) => getFlexStyles(props)}
`

const StyledSection = styled.section<StyledProps>`
    ${(props) => getFlexStyles(props)}
`

const StyledArticle = styled.article<StyledProps>`
    ${(props) => getFlexStyles(props)}
`

const StyledHeader = styled.header<StyledProps>`
    ${(props) => getFlexStyles(props)}
`

const StyledFooter = styled.footer<StyledProps>`
    ${(props) => getFlexStyles(props)}
`

const StyledMain = styled.main<StyledProps>`
    ${(props) => getFlexStyles(props)}
`

const StyledAside = styled.aside<StyledProps>`
    ${(props) => getFlexStyles(props)}
`

const StyledNav = styled.nav<StyledProps>`
    ${(props) => getFlexStyles(props)}
`

const StyledUl = styled.ul<StyledProps>`
    ${(props) => getFlexStyles(props)}
    list-style: none;
    margin: 0;
    padding: 0;
`

const StyledOl = styled.ol<StyledProps>`
    ${(props) => getFlexStyles(props)}
    list-style: none;
    margin: 0;
    padding: 0;
`

const StyledForm = styled.form<StyledProps>`
    ${(props) => getFlexStyles(props)}
`

const StyledSpan = styled.span<StyledProps>`
    ${(props) => getFlexStyles(props)}
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

const Flex = React.forwardRef<HTMLElement, FlexProps>(
    (
        {
            gap = 'none',
            align = 'stretch',
            justify = 'start',
            direction = 'row',
            wrap = false,
            as = 'div',
            className,
            children,
            ...props
        },
        ref
    ) => {
        const StyledComponent = StyledElements[as]

        return (
            <StyledComponent
                ref={ref as React.Ref<never>}
                className={className}
                $gap={gap}
                $align={align}
                $justify={justify}
                $direction={direction}
                $wrap={wrap}
                data-slot="flex"
                {...props}
            >
                {children}
            </StyledComponent>
        )
    }
)
Flex.displayName = 'Flex'

export default Flex
