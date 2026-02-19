import styled from "@emotion/styled";

const GRID_SIZE = 32;
const GRID_LINE_WIDTH = 1.5;

const GridContainer = styled.div`
    &, div {
        position: absolute;
        inset: 0;
        z-index: 0;
    }
`

const GridPattern = styled.div`
    background-size: ${GRID_SIZE}px ${GRID_SIZE}px;
    background-image: linear-gradient(to right, var(--grid-line) ${GRID_LINE_WIDTH}px, transparent ${GRID_LINE_WIDTH}px), linear-gradient(to bottom, var(--grid-line) ${GRID_LINE_WIDTH}px, transparent ${GRID_LINE_WIDTH}px);
`

const FadeToBackground = styled.div`
    background: "linear-gradient(to bottom, transparent, var(--background))";
    z-index: 10;
`

const StaticGridPattern: React.FC = () => {
    return (
        <GridContainer>
            <GridPattern />
            <FadeToBackground />
        </GridContainer>
    )
}

export default StaticGridPattern;