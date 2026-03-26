import styled from "@emotion/styled";
import ShadowBox from "./ShadowBox";
import { Theme } from "./theme";
import { Button } from "../ui";
import Logo from "./Logo";
import { HORIZONTAL_PADDING } from "./Container";

const ControlContainer = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
`;

const LayoutContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    // width: 100%;
    height: 100%;
    width: 100%;

    :first-child {
     align-self: flex-start;
     flex: 1;
    }
`;

const NavigationItems = styled.div`
    // display: flex;
    // justify-content: flex-end;
    // gap: 20px;
    // align-items: center;
    // width: 100%;
    // height: 100%;
`;

const Navigation: React.FC = () => {
    return (
        <ControlContainer>
            <ShadowBox backgroundColor={Theme.colors.light.yellow} offset="xsm" styles={{ wrapper: { width: `calc(100% - ${HORIZONTAL_PADDING * 2}px)` }, content: { padding: '0 20px' } }}>
                <LayoutContainer>
                    <Logo />
                    <NavigationItems>
                        <Button variant="ghost">1. Home</Button>
                        <Button variant="ghost">2. Resume</Button>
                        <Button variant="ghost">3. Projects</Button>
                        <Button>4. Contact</Button>
                    </NavigationItems>
                </LayoutContainer>
            </ShadowBox>
        </ControlContainer>
    )
}

export default Navigation;