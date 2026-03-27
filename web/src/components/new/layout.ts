import styled from '@emotion/styled'
import { css } from '@emotion/react'
import type { CSSObject } from '@emotion/react'
import { Container } from '@/components/ui'
import { Theme } from './theme'

export const SectionContainer = styled(Container)<{ backgroundColor?: string }>`
  background-color: ${(props) => props.backgroundColor || Theme.colors.dark.contentBackground};
`

export const PageContent = styled.div<{ $css?: CSSObject }>`
  display: flex;
  padding: 0 200px;
  width: 100%;
  max-width: 1800px;
  margin-bottom: 100px;
  ${({ $css }) => $css && css($css)}
`
