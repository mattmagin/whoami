import React from 'react'
import styled from '@emotion/styled'
import { Label as LabelPrimitive } from 'radix-ui'
import { themeVars } from '@/theme'

const StyledLabel = styled(LabelPrimitive.Root)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
  font-weight: 500;
  font-family: ${themeVars.fonts.sans};
  user-select: none;

  /* When parent group is disabled */
  [data-disabled='true'] & {
    pointer-events: none;
    opacity: 0.5;
  }

  /* When associated input is disabled (peer) */
  &:has(+ :disabled),
  &:has(~ :disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> { }

const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <StyledLabel
    ref={ref}
    data-slot="label"
    className={className}
    {...props}
  />
))
Label.displayName = 'Label'

export default Label