import styled from '@emotion/styled'
import { Theme } from './theme'
import { css, type CSSObject } from '@emotion/react'

const ROUNDED_PX = { sm: 4, md: 8, lg: 16 } as const

export const OFFSET_STYLES = {
    xxsm: {
        offset: 4,
        borderThickness: 2
    },
    xsm: {
        offset: 6,
        borderThickness: 3
    },
    sm: {
        offset: 10,
        borderThickness: 4
    },
    md: {
        offset: 20,
        borderThickness: 4
    },
    lg: {
        offset: 30,
        borderThickness: 4
    }
} as const;

type OFFSET = keyof typeof OFFSET_STYLES;

export type ShadowBoxRounded = keyof typeof ROUNDED_PX

export interface ShadowBoxProps {
    children: React.ReactNode
    backgroundColor?: string //TODO: implement color type
    borderColor?: string //TODO: implement color type
    offset?: OFFSET
    rounded?: ShadowBoxRounded
    className?: string
    styles?: {
        wrapper?: React.CSSProperties
        background?: React.CSSProperties
        content?: React.CSSProperties
    }
}

type WrapperProps = { $offset: OFFSET, $style?: React.CSSProperties }

const Wrapper = styled.div<WrapperProps>`
    position: relative;
    width: 100%;
    height: 100%;
    padding-right: ${(p) => OFFSET_STYLES[p.$offset].offset}px;
    padding-bottom: ${(p) => OFFSET_STYLES[p.$offset].offset}px;
    ${({ $style }) => ($style ? css($style as CSSObject) : undefined)}
`

const Inner = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`

type BackgroundProps = {
    $offset: OFFSET
    $roundedPx: number
    $borderColor: string
    $style?: React.CSSProperties
}

const Background = styled.div<BackgroundProps>`
    position: absolute;
    inset: 0;
    z-index: 1;
    transform: translate(${(p) => OFFSET_STYLES[p.$offset].offset}px, ${(p) => OFFSET_STYLES[p.$offset].offset}px);
    background-color: ${(p) => p.$borderColor};
    border-radius: ${(p) => p.$roundedPx}px;
    pointer-events: none;
    ${({ $style }) => ($style ? css($style as CSSObject) : undefined)}
`

type ContentProps = {
    $roundedPx: number
    $backgroundColor: string
    $borderColor: string
    $style?: React.CSSProperties
    $offset: OFFSET
}

const Content = styled.div<ContentProps>`
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-width: ${(p) => OFFSET_STYLES[p.$offset].borderThickness}px;
    border-style: solid;
    border-color: ${(p) => p.$borderColor};
    background-color: ${(p) => p.$backgroundColor};
    border-radius: ${(p) => p.$roundedPx}px;
    ${({ $style }) => ($style ? css($style as CSSObject) : undefined)};
`

const ShadowBox: React.FC<ShadowBoxProps> = ({
    children,
    backgroundColor = Theme.colors.dark.contentBackground,
    borderColor = Theme.colors.dark.borderOutline,
    offset = 'md',
    rounded,
    className,
    styles,
}) => {
    const roundedPx = rounded !== undefined ? ROUNDED_PX[rounded] : 0

    return (
        <Wrapper className={className} $offset={offset} $style={styles?.wrapper}>
            <Inner>
                <Background
                    $offset={offset}
                    $roundedPx={roundedPx}
                    $borderColor={borderColor}
                    style={styles?.background}
                />
                <Content
                    $offset={offset}
                    $roundedPx={roundedPx}
                    $backgroundColor={backgroundColor}
                    $borderColor={borderColor}
                    style={styles?.content}>
                    {children}
                </Content>
            </Inner>
        </Wrapper>
    )
}

export default ShadowBox
