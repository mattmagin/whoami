import styled from '@emotion/styled'
import { css } from '@emotion/react'
import type { CSSObject } from '@emotion/react'
import { Container } from '@/components/ui'
import { Theme } from './theme'

export const PAGE_SHELL_BREAKPOINT_PX = 1200;

/** Max width for main column — keeps line length and grid readable on ultrawide */
// export const PAGE_MAX_WIDTH = '72rem'

/** Horizontal inset from the outer card; matches nav + page content */
export const PAGE_EDGE_PADDING = '9rem';
export const PAGE_EDGE_PADDING_RESPONSIVE = css`
  padding: 0 2rem;

  @media (min-width: ${PAGE_SHELL_BREAKPOINT_PX}) {
    padding: 0 4rem;
  }

  @media (min-width: 1500px) {
    padding: 0 6rem;
  }

  @media (min-width: 2000px) {
    padding: 0 8rem;
  }
`

/** Vertical rhythm — scaled up to pair with generous PAGE_EDGE_PADDING */
export const PAGE_SECTION_GAP = '3rem';

export const pageShellStyles = css`
  box-sizing: border-box;
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  ${PAGE_EDGE_PADDING_RESPONSIVE}
`

export const PageShell = styled.div`
  ${pageShellStyles}
`

export const SectionContainer = styled(Container) <{ backgroundColor?: string }>`
  background-color: ${(props) => props.backgroundColor || Theme.colors.dark.contentBackground};
`

export const PageContent = styled.div<{ $css?: CSSObject }>`
  ${pageShellStyles}
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${PAGE_SECTION_GAP};
  padding-top: ${PAGE_SECTION_GAP};
  padding-bottom: clamp(4rem, 12vw, 9rem);
  ${({ $css }) => $css && css($css)}
`
