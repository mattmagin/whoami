import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Slot } from 'radix-ui'
import { themeVars } from '@/theme'

export type ButtonVariant = 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'md' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: ${themeVars.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
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

const variantStyles = {
  primary: css`
    background: ${themeVars.colors.primary};
    color: ${themeVars.colors.primaryForeground};

    &:hover {
      background: color-mix(in srgb, ${themeVars.colors.primary} 90%, transparent);
    }
  `,
  destructive: css`
    background: ${themeVars.colors.destructive};
    color: white;

    &:hover {
      background: color-mix(in srgb, ${themeVars.colors.destructive} 90%, transparent);
    }

    &:focus-visible {
      outline-color: ${themeVars.colors.destructive};
    }
  `,
  outline: css`
    background: ${themeVars.colors.background};
    border-color: ${themeVars.colors.border};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${themeVars.colors.accent};
      color: ${themeVars.colors.accentForeground};
    }
  `,
  secondary: css`
    background: ${themeVars.colors.secondary};
    color: ${themeVars.colors.secondaryForeground};

    &:hover {
      background: color-mix(in srgb, ${themeVars.colors.secondary} 80%, transparent);
    }
  `,
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

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  ${baseStyles}
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`

const StyledSlot = styled(Slot.Root) <{ $variant: ButtonVariant; $size: ButtonSize }>`
  ${baseStyles}
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`

const Button = React.forwardRef<React.ComponentRef<'button'>, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? StyledSlot : StyledButton

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={className}
        $variant={variant}
        $size={size}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

// Export buttonVariants type for API compatibility
export const buttonVariants = {
  variant: ['primary', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const,
  size: ['md', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const,
}

export default Button
