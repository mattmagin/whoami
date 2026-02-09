import { css } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

// =============================================================================
// Shared Types
// =============================================================================

/** Spacing scale for gaps and padding */
export type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** Flex/Grid alignment (align-items) */
export type AlignItems = 'start' | 'center' | 'end' | 'baseline' | 'stretch'

/** Flex/Grid justification (justify-content) */
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around'

/** Container max-width sizes */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

/** Padding sizes */
export type PaddingSize = 'none' | 'sm' | 'md' | 'lg'

/** Flex direction */
export type FlexDirection = 'row' | 'col'

/** Responsive value - can be a single value or breakpoint-specific */
export type ResponsiveValue<T> = T | {
    base?: T
    sm?: T
    md?: T
    lg?: T
    xl?: T
}

/** Valid HTML elements for layout components */
export type LayoutElement =
    | 'div'
    | 'section'
    | 'article'
    | 'header'
    | 'footer'
    | 'main'
    | 'aside'
    | 'nav'
    | 'ul'
    | 'ol'
    | 'form'
    | 'span'

// =============================================================================
// CSS Style Mappings
// =============================================================================

/** Gap size to CSS value mapping */
export const gapValues: Record<GapSize, string> = {
    none: '0',
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
}

/** Align-items CSS value mapping */
export const alignValues: Record<AlignItems, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    baseline: 'baseline',
    stretch: 'stretch',
}

/** Justify-content CSS value mapping */
export const justifyValues: Record<JustifyContent, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
}

/** Container max-width mapping */
export const containerSizeValues: Record<ContainerSize, string> = {
    sm: '48rem',     // max-w-3xl (768px)
    md: '56rem',     // max-w-4xl (896px)
    lg: '64rem',     // max-w-5xl (1024px)
    xl: '72rem',     // max-w-6xl (1152px)
    full: '100%',
}

/** Vertical padding mapping */
export const paddingValues: Record<PaddingSize, string> = {
    none: '0',
    sm: '2rem',      // 32px
    md: '4rem',      // 64px
    lg: '6rem',      // 96px
}

// =============================================================================
// CSS Style Generators
// =============================================================================

/** Generate gap style */
export const getGapStyle = (gap: GapSize): SerializedStyles => css`
    gap: ${gapValues[gap]};
`

/** Generate align-items style */
export const getAlignStyle = (align: AlignItems): SerializedStyles => css`
    align-items: ${alignValues[align]};
`

/** Generate justify-content style */
export const getJustifyStyle = (justify: JustifyContent): SerializedStyles => css`
    justify-content: ${justifyValues[justify]};
`

// =============================================================================
// Breakpoint values for media queries
// =============================================================================

export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
} as const
