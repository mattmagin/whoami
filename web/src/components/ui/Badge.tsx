import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Slot } from 'radix-ui'
import { themeVars } from '@/theme'

type BadgeVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'

interface BadgeProps extends React.ComponentPropsWithoutRef<'span'> {
  variant?: BadgeVariant
  asChild?: boolean
}

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: ${themeVars.fonts.sans};
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
  gap: 0.25rem;
  transition: color 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;

  & > svg {
    width: 0.75rem;
    height: 0.75rem;
    pointer-events: none;
  }

  &:focus-visible {
    outline: 2px solid ${themeVars.colors.ring};
    outline-offset: 2px;
  }
`

const variantStyles = {
  primary: css`
    background: ${themeVars.colors.primary};
    color: ${themeVars.colors.primaryForeground};

    a&:hover {
      background: color-mix(in srgb, ${themeVars.colors.primary} 90%, transparent);
    }
  `,
  secondary: css`
    background: ${themeVars.colors.secondary};
    color: ${themeVars.colors.secondaryForeground};

    a&:hover {
      background: color-mix(in srgb, ${themeVars.colors.secondary} 90%, transparent);
    }
  `,
  destructive: css`
    background: ${themeVars.colors.destructive};
    color: white;

    a&:hover {
      background: color-mix(in srgb, ${themeVars.colors.destructive} 90%, transparent);
    }

    &:focus-visible {
      outline-color: ${themeVars.colors.destructive};
    }
  `,
  outline: css`
    border-color: ${themeVars.colors.border};
    color: ${themeVars.colors.foreground};
    background: transparent;

    a&:hover {
      background: ${themeVars.colors.accent};
      color: ${themeVars.colors.accentForeground};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${themeVars.colors.foreground};

    a&:hover {
      background: ${themeVars.colors.accent};
      color: ${themeVars.colors.accentForeground};
    }
  `,
  link: css`
    background: transparent;
    color: ${themeVars.colors.primary};
    text-underline-offset: 4px;

    a&:hover {
      text-decoration: underline;
    }
  `,
}

const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  ${baseStyles}
  ${({ $variant }) => variantStyles[$variant]}
`

const StyledSlot = styled(Slot.Root) <{ $variant: BadgeVariant }>`
  ${baseStyles}
  ${({ $variant }) => variantStyles[$variant]}
`

const Badge = React.forwardRef<React.ComponentRef<'span'>, BadgeProps>(
  ({ className, variant = 'primary', asChild = false, ...props }, ref) => {
    const Comp = asChild ? StyledSlot : StyledBadge

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        className={className}
        $variant={variant}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export default Badge
