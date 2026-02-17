import React from 'react'
import styled from '@emotion/styled'
import { themeVars } from '@/theme'

export interface TextareaProps extends React.ComponentPropsWithoutRef<'textarea'> { }

const StyledTextarea = styled.textarea`
  display: flex;
  min-height: 4rem;
  width: 100%;
  border-radius: ${themeVars.radii.md};
  border: 1px solid ${themeVars.colors.input};
  background: transparent;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-family: ${themeVars.fonts.sans};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  outline: none;
  field-sizing: content;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }

  &::placeholder {
    color: ${themeVars.colors.mutedForeground};
  }

  &:focus-visible {
    border-color: ${themeVars.colors.ring};
    box-shadow: 0 0 0 3px color-mix(in srgb, ${themeVars.colors.ring} 50%, transparent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[aria-invalid='true'] {
    border-color: ${themeVars.colors.destructive};
    box-shadow: 0 0 0 3px color-mix(in srgb, ${themeVars.colors.destructive} 20%, transparent);
  }

  /* Dark mode adjustments via CSS variables */
  .dark & {
    background: color-mix(in srgb, ${themeVars.colors.input} 30%, transparent);
  }
`

const Textarea = React.forwardRef<React.ComponentRef<'textarea'>, TextareaProps>(
  ({ className, ...props }, ref) => (
    <StyledTextarea
      ref={ref}
      data-slot="textarea"
      className={className}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

export default Textarea
