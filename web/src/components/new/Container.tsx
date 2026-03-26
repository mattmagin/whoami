import styled from '@emotion/styled'
import ShadowBox from './ShadowBox'
import { Theme } from './theme'

interface ContainerProps {
    children: React.ReactNode
}

const OverallContainer = styled.div`
    width: 100vw;
    height: 100vh;
    padding: 50px;
    display: flex;
    justify-content: center;
    background-color: ${Theme.colors.dark.contentBackground}; /*TODO: this should be on the body*/
`

const ControlContainer = styled.div`
    width: 100%;
    height: fill-available;
    max-width: 2200px;
`

export const HORIZONTAL_PADDING = 30;

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <OverallContainer>
            <ControlContainer>
                <ShadowBox styles={{ content: { padding: '30px 0' } }}>{children}</ShadowBox>
            </ControlContainer>
        </OverallContainer>
    )
}

export default Container
