import styled from "@emotion/styled";
import { Theme } from "./theme";
import type { Color } from "./theme";

const BORDER_TOP_WIDTH = 8;
const BORDER_BOTTOM_WIDTH = 5;
const COLOR_BAR_WIDTH = 11;

const Separator = styled.div<{ color: Color }>`
    width: 100%;
    height: ${BORDER_TOP_WIDTH + BORDER_BOTTOM_WIDTH + COLOR_BAR_WIDTH}px;
    background-color: ${({ color }) => Theme.colors.light[color]};
    border-color: ${Theme.colors.light.black};
    border-style: solid;
    border-width: ${BORDER_TOP_WIDTH}px 0 ${BORDER_BOTTOM_WIDTH}px 0;
`;

export default Separator;