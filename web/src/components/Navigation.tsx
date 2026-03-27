import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import ShadowBox from "./ShadowBox";
import { Theme } from "./theme";
import { Button } from "./ui";
import Logo from "./Logo";
import { HORIZONTAL_PADDING } from "./Container";
import { NAV_ROUTES, ROUTE_DEFINITIONS } from "@/consts";

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
    height: 100%;
    width: 100%;

    :first-child {
     align-self: flex-start;
    }
`;

const NavigationItems = styled.div``;

const NavLink = styled(Link)`
    text-decoration: none;
`;

const ExternalNavLink = styled.a`
    text-decoration: none;
`;

const Navigation: React.FC = () => {
    return (
        <ControlContainer>
            <ShadowBox backgroundColor={Theme.colors.light.yellow} offset="xsm" styles={{ wrapper: { width: `calc(100% - ${HORIZONTAL_PADDING * 2}px)` }, content: { padding: '0 20px' } }}>
                <LayoutContainer>
                    <NavLink to="/">
                        <Logo />
                    </NavLink>
                    <NavigationItems>
                        {NAV_ROUTES.map((routeKey, index) => {
                            const route = ROUTE_DEFINITIONS[routeKey];
                            const isContact = route.type === 'contact';
                            if (route.externalUrl) {
                                return (
                                    <ExternalNavLink href={route.externalUrl} target="_blank" rel="noopener noreferrer" key={route.type}>
                                        <Button variant="ghost">
                                            {index + 1}. {route.label}
                                        </Button>
                                    </ExternalNavLink>
                                );
                            }
                            return (
                                <NavLink to={route.path} key={route.type}>
                                    <Button
                                        variant={isContact ? "primary" : "ghost"}
                                    >
                                        {index + 1}. {route.label}
                                    </Button>
                                </NavLink>
                            );
                        })}
                    </NavigationItems>
                </LayoutContainer>
            </ShadowBox>
        </ControlContainer>
    )
}

export default Navigation;
