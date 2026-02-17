import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { themeVars } from '@/theme'

export type TextVariant =
    | 'pageTitle'
    | 'sectionTitle'
    | 'cardTitle'
    | 'subtitle'
    | 'body'
    | 'bodySmall'
    | 'muted'
    | 'label'

export type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'li'

// Map variants to their default HTML elements
const defaultElements: Record<TextVariant, TextElement> = {
    pageTitle: 'h1',
    sectionTitle: 'h2',
    cardTitle: 'h3',
    subtitle: 'p',
    body: 'p',
    bodySmall: 'p',
    muted: 'span',
    label: 'span',
}

// Base styles shared across all text variants
const baseStyles = css`
    margin: 0;
    padding: 0;
`

// Variant-specific styles
const variantStyles = {
    pageTitle: css`
        font-family: ${themeVars.fonts.serif};
        font-size: 2.25rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        line-height: 1.2;
        color: ${themeVars.colors.foreground};

        @media (min-width: 768px) {
            font-size: 3rem;
        }

        @media (min-width: 1024px) {
            font-size: 3.75rem;
        }
    `,
    sectionTitle: css`
        font-family: ${themeVars.fonts.serif};
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: -0.025em;
        line-height: 1.3;
        color: ${themeVars.colors.foreground};

        @media (min-width: 768px) {
            font-size: 1.875rem;
        }
    `,
    cardTitle: css`
        font-family: ${themeVars.fonts.serif};
        font-size: 1.25rem;
        font-weight: 600;
        letter-spacing: -0.025em;
        line-height: 1.4;
        color: ${themeVars.colors.foreground};
    `,
    subtitle: css`
        font-size: 1.25rem;
        line-height: 1.5;
        color: ${themeVars.colors.mutedForeground};
    `,
    body: css`
        font-size: 1.125rem;
        line-height: 1.75;
        color: ${themeVars.colors.mutedForeground};
    `,
    bodySmall: css`
        font-size: 0.875rem;
        line-height: 1.5;
        color: ${themeVars.colors.mutedForeground};
    `,
    muted: css`
        color: ${themeVars.colors.mutedForeground};
    `,
    label: css`
        font-size: 0.875rem;
        font-weight: 500;
        color: ${themeVars.colors.mutedForeground};
    `,
}

interface StyledProps {
    $variant: TextVariant
}

// Pre-create styled components for each element type
const StyledH1 = styled.h1<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledH2 = styled.h2<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledH3 = styled.h3<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledH4 = styled.h4<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledH5 = styled.h5<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledH6 = styled.h6<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledP = styled.p<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledSpan = styled.span<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledDiv = styled.div<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledLi = styled.li<StyledProps>`
    ${baseStyles}
    ${({ $variant }) => variantStyles[$variant]}
`

const StyledElements = {
    h1: StyledH1,
    h2: StyledH2,
    h3: StyledH3,
    h4: StyledH4,
    h5: StyledH5,
    h6: StyledH6,
    p: StyledP,
    span: StyledSpan,
    div: StyledDiv,
    li: StyledLi,
}

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    variant?: TextVariant
    as?: TextElement
    children: React.ReactNode
}

const Text = React.forwardRef<HTMLElement, TextProps>(
    ({ variant = 'body', as, className, children, ...props }, ref) => {
        // Use the `as` prop if provided, otherwise use the default element for the variant
        const element = as ?? defaultElements[variant]
        const StyledComponent = StyledElements[element]

        return (
            <StyledComponent
                ref={ref as React.Ref<never>}
                className={className}
                $variant={variant}
                data-slot="text"
                data-variant={variant}
                {...props}
            >
                {children}
            </StyledComponent>
        )
    }
)
Text.displayName = 'Text'

// Export textVariants for API compatibility
export const textVariants = {
    variant: ['pageTitle', 'sectionTitle', 'cardTitle', 'subtitle', 'body', 'bodySmall', 'muted', 'label'] as const,
    element: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'li'] as const,
}

export default Text
