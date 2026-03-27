import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Slot } from 'radix-ui'
import ShadowBox from '@/components/ShadowBox'
import { Theme } from '@/components/theme'
import { themeVars } from '@/theme'
import type { Color, ThemeVariants } from '@/components/theme'

type ButtonVariant = 'primary' | 'ghost' | 'link'
type ButtonSize = 'md' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  rounded?: boolean
  color?: Color
}

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: ${themeVars.radii.md};
  font-size: 0.875rem;
  font-weight: 700;
  font-family: ${themeVars.fonts.sans};
  transition: all 0.15s ease;
  outline: none;
  border: 1px solid transparent;
  cursor: pointer;
  flex-shrink: 0;
  width: fit-content;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid ${themeVars.colors.ring};
    outline-offset: 2px;
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  & svg:not([class*='size-']) {
    width: 1rem;
    height: 1rem;
  }
`

const primaryInnerStyles = css`
  appearance: none;
  border: none;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  color: ${Theme.colors.dark.borderOutline};
  width: 100%;
  min-width: 0;
  min-height: 0;
`

const variantStyles = {
  ghost: css`
    background: transparent;

    &:hover {
      background: ${themeVars.colors.accent};
      color: ${themeVars.colors.accentForeground};
    }
  `,
  link: css`
    background: transparent;
    color: ${themeVars.colors.primary};
    text-decoration-line: underline;
    text-underline-offset: 4px;

    &:hover {
      text-decoration-line: underline;
    }
  `,
}

const sizeStyles = {
  md: css`
    height: 2.25rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;

    &:has(> svg) {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
  `,
  xs: css`
    height: 1.5rem;
    gap: 0.25rem;
    border-radius: ${themeVars.radii.md};
    padding: 0 0.5rem;
    font-size: 0.75rem;

    &:has(> svg) {
      padding-left: 0.375rem;
      padding-right: 0.375rem;
    }

    & svg:not([class*='size-']) {
      width: 0.75rem;
      height: 0.75rem;
    }
  `,
  sm: css`
    height: 2rem;
    gap: 0.375rem;
    border-radius: ${themeVars.radii.md};
    padding: 0 0.75rem;

    &:has(> svg) {
      padding-left: 0.625rem;
      padding-right: 0.625rem;
    }
  `,
  lg: css`
    height: 2.5rem;
    border-radius: ${themeVars.radii.md};
    padding: 0 1.5rem;
    font-size: 1.25rem;

    &:has(> svg) {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  `,
  icon: css`
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
  `,
  'icon-xs': css`
    width: 1.5rem;
    height: 1.5rem;
    border-radius: ${themeVars.radii.md};
    padding: 0;

    & svg:not([class*='size-']) {
      width: 0.75rem;
      height: 0.75rem;
    }
  `,
  'icon-sm': css`
    width: 2rem;
    height: 2rem;
    padding: 0;
  `,
  'icon-lg': css`
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
  `,
}

const roundedStyles = {
  true: css`
    border-radius: ${themeVars.radii.md};
  `,
  false: css`
    border-radius: 0px;
  `,
}

const StyledButton = styled.button<{ $variant: Exclude<ButtonVariant, 'primary'>; $size: ButtonSize; $rounded: boolean }>`
  ${baseStyles}
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
  ${({ $rounded }) => roundedStyles[$rounded ? 'true' : 'false']}
`

const StyledSlot = styled(Slot.Root) <{
  $variant: Exclude<ButtonVariant, 'primary'>
  $size: ButtonSize
  $rounded: boolean
}>`
  ${baseStyles}
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
  ${({ $rounded }) => roundedStyles[$rounded ? 'true' : 'false']}
`

const StyledPrimaryButton = styled.button<{ $size: ButtonSize }>`
  ${baseStyles}
  ${primaryInnerStyles}
  ${({ $size }) => sizeStyles[$size]}
`

const StyledPrimarySlot = styled(Slot.Root) <{ $size: ButtonSize }>`
  ${baseStyles}
  ${primaryInnerStyles}
  ${({ $size }) => sizeStyles[$size]}
`

const primaryShadowBoxStyles = {
  wrapper: {
    display: 'inline-flex' as const,
    width: 'fit-content' as const,
    maxWidth: '100%',
    height: 'fit-content' as const,
    verticalAlign: 'middle' as const,
  },
  content: {
    padding: 0,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minWidth: 0,
  },
}

const Button = React.forwardRef<React.ComponentRef<'button'>, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', asChild = false, rounded = false, color = 'green', ...props },
    ref
  ) => {
    if (variant === 'primary') {
      const Comp = asChild ? StyledPrimarySlot : StyledPrimaryButton
      return (
        <ShadowBox
          backgroundColor={Theme.colors.light[color as Color]}
          className={className}
          offset="xxsm"
          rounded={rounded ? 'sm' : undefined}
          styles={primaryShadowBoxStyles}
        >
          <Comp
            ref={ref}
            data-slot="button"
            data-variant="primary"
            data-size={size}
            data-rounded={rounded}
            $size={size}
            {...props}
          />
        </ShadowBox>
      )
    }

    const Comp = asChild ? StyledSlot : StyledButton

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-rounded={rounded}
        className={className}
        $variant={variant}
        $size={size}
        $rounded={rounded}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button
