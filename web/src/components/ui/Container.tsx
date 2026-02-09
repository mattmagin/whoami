import * as React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import {
    type ContainerSize,
    type PaddingSize,
    type LayoutElement,
    containerSizeValues,
    paddingValues,
} from './layout.types'

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
    /** Max-width size */
    size?: ContainerSize
    /** Vertical padding */
    padding?: PaddingSize
    /** Whether to center the container */
    centered?: boolean
    /** HTML element to render as */
    as?: LayoutElement
    children: React.ReactNode
}

interface StyledProps {
    $size: ContainerSize
    $padding: PaddingSize
    $centered: boolean
}

const getContainerStyles = (size: ContainerSize, padding: PaddingSize, centered: boolean) => css`
    max-width: ${containerSizeValues[size]};
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: ${paddingValues[padding]};
    padding-bottom: ${paddingValues[padding]};
    ${centered && 'margin-left: auto; margin-right: auto;'}
`

const StyledDiv = styled.div<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
`

const StyledSection = styled.section<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
`

const StyledArticle = styled.article<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
`

const StyledHeader = styled.header<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
`

const StyledFooter = styled.footer<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
`

const StyledMain = styled.main<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
`

const StyledAside = styled.aside<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
`

const StyledNav = styled.nav<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
`

const StyledUl = styled.ul<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
    list-style: none;
    margin: 0;
`

const StyledOl = styled.ol<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
    list-style: none;
    margin: 0;
`

const StyledForm = styled.form<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
`

const StyledSpan = styled.span<StyledProps>`
    ${({ $size, $padding, $centered }) => getContainerStyles($size, $padding, $centered)}
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

const Container = React.forwardRef<HTMLElement, ContainerProps>(
    (
        {
            size = 'lg',
            padding = 'lg',
            centered = true,
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
                $size={size}
                $padding={padding}
                $centered={centered}
                data-slot="container"
                {...props}
            >
                {children}
            </StyledComponent>
        )
    }
)
Container.displayName = 'Container'

export default Container
