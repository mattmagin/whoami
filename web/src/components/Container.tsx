import styled from '@emotion/styled'
import ShadowBox from './ShadowBox'
import { Theme } from './theme'
import { DotBackground } from './DotBackground'

interface ContainerProps {
    children: React.ReactNode
}

const OverallContainer = styled.div`
    width: 100vw;
    min-height: 100vh;
    padding: 50px;
    display: flex;
    justify-content: center;
    background-color: ${Theme.colors.dark.contentBackground}; /*TODO: this should be on the body*/
`

const ControlContainer = styled.div`
    width: 100%;
    max-width: 2200px;
`

export const HORIZONTAL_PADDING = 30;

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <OverallContainer className="overall-container">
            <ControlContainer className="container-content">
                {/* TODO move to const along with the side padding */}
                <ShadowBox styles={{ content: { padding: '2rem 0' } }}>
                    <DotBackground />
                    <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
                        {children}
                    </div>
                </ShadowBox>
            </ControlContainer>
        </OverallContainer>
    )
}

export default Container
