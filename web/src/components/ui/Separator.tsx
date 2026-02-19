import React from 'react'
import styled from '@emotion/styled'
import { Separator as SeparatorPrimitive } from 'radix-ui'
import { themeVars } from '@/theme'

const StyledSeparator = styled(SeparatorPrimitive.Root)`
  flex-shrink: 0;
  background: ${themeVars.colors.border};

  &[data-orientation='horizontal'] {
    height: 1px;
    width: 100%;
  }

  &[data-orientation='vertical'] {
    height: 100%;
    width: 1px;
  }
`

type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <StyledSeparator
    ref={ref}
    data-slot="separator"
    decorative={decorative}
    orientation={orientation}
    className={className}
    {...props}
  />
))
Separator.displayName = 'Separator'

export default Separator
