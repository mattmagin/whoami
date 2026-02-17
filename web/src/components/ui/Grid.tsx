import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import {
    type GapSize,
    type LayoutElement,
    type ResponsiveValue,
    gapValues,
    breakpoints,
} from './layout.types'

export interface GridProps extends React.HTMLAttributes<HTMLElement> {
    /** Number of columns - can be responsive */
    cols?: ResponsiveValue<number>
    /** Gap between grid items */
    gap?: GapSize
    /** HTML element to render as */
    as?: LayoutElement
    children: React.ReactNode
}

interface StyledProps {
    $cols: ResponsiveValue<number>
    $gap: GapSize
}

const baseStyles = css`
    display: grid;
`

const getGridStyles = (cols: ResponsiveValue<number>, gap: GapSize) => {
    // Handle simple number value
    if (typeof cols === 'number') {
        return css`
            ${baseStyles}
            gap: ${gapValues[gap]};
            grid-template-columns: repeat(${cols}, minmax(0, 1fr));
        `
    }

    // Handle responsive object
    const { base = 1, sm, md, lg, xl } = cols

    return css`
        ${baseStyles}
        gap: ${gapValues[gap]};
        grid-template-columns: repeat(${base}, minmax(0, 1fr));

        ${sm !== undefined && `
            @media (min-width: ${breakpoints.sm}) {
                grid-template-columns: repeat(${sm}, minmax(0, 1fr));
            }
        `}

        ${md !== undefined && `
            @media (min-width: ${breakpoints.md}) {
                grid-template-columns: repeat(${md}, minmax(0, 1fr));
            }
        `}

        ${lg !== undefined && `
            @media (min-width: ${breakpoints.lg}) {
                grid-template-columns: repeat(${lg}, minmax(0, 1fr));
            }
        `}

        ${xl !== undefined && `
            @media (min-width: ${breakpoints.xl}) {
                grid-template-columns: repeat(${xl}, minmax(0, 1fr));
            }
        `}
    `
}

const StyledDiv = styled.div<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
`

const StyledSection = styled.section<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
`

const StyledArticle = styled.article<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
`

const StyledHeader = styled.header<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
`

const StyledFooter = styled.footer<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
`

const StyledMain = styled.main<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
`

const StyledAside = styled.aside<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
`

const StyledNav = styled.nav<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
`

const StyledUl = styled.ul<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
    list-style: none;
    margin: 0;
    padding: 0;
`

const StyledOl = styled.ol<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
    list-style: none;
    margin: 0;
    padding: 0;
`

const StyledForm = styled.form<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
`

const StyledSpan = styled.span<StyledProps>`
    ${({ $cols, $gap }) => getGridStyles($cols, $gap)}
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

const Grid = React.forwardRef<HTMLElement, GridProps>(
    ({ cols = 1, gap = 'md', as = 'div', className, children, ...props }, ref) => {
        const StyledComponent = StyledElements[as]

        return (
            <StyledComponent
                ref={ref as React.Ref<never>}
                className={className}
                $cols={cols}
                $gap={gap}
                data-slot="grid"
                {...props}
            >
                {children}
            </StyledComponent>
        )
    }
)
Grid.displayName = 'Grid'

export default Grid
