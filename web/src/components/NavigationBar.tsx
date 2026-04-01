import { useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import ShadowBox from "./ShadowBox";
import { Theme } from "./theme";
import { Button } from "./ui";
import Logo from "./Logo";
import { PageShell, PAGE_SHELL_BREAKPOINT_PX } from "./layout";
import { NAV_ROUTES, ROUTE_DEFINITIONS } from "@/consts";
import {
    Sheet,
    SheetTrigger,
    SheetContent
} from "./ui/sheet";

const NavPageShell = styled(PageShell)`
    height: 80px;
    display: flex;
    align-items: center;
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

const NavigationItems = styled.div`
    display: none;

    @media (min-width: ${PAGE_SHELL_BREAKPOINT_PX}px) {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;

const MobileNav = styled.div`
    display: flex;
    align-items: center;

    @media (min-width: ${PAGE_SHELL_BREAKPOINT_PX}px) {
        display: none;
    }
`;

const NavLink = styled(Link)`
    text-decoration: none;
`;

const NavigationBar: React.FC = () => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const navigate = useNavigate();

    const handleInternalNav = (path: string) => {
        setSheetOpen(false);
        navigate(path);
    };

    const NavigationComponents = NAV_ROUTES.map((routeKey, index) => {
        const route = ROUTE_DEFINITIONS[routeKey];

        return (
            <NavLink to={route.path} key={route.type}>
                <Button variant={route.navigationVariant || "ghost"} onClick={() => handleInternalNav(route.path)}>
                    {index + 1}. {route.label}
                </Button>
            </NavLink>
        );
    });

    return (
        <NavPageShell>
            <ShadowBox backgroundColor={Theme.colors.light.yellow} offset="xsm" styles={{ wrapper: { width: '100%' }, content: { padding: '0 16px' } }}>
                <LayoutContainer>
                    <NavLink to="/">
                        <Logo />
                    </NavLink>
                    <NavigationItems>
                        {NavigationComponents}
                    </NavigationItems>
                    <MobileNav>
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu strokeWidth={4} className="size-5" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                style={{
                                    backgroundColor: Theme.colors.light.yellow,
                                    borderLeft: `4px solid ${Theme.colors.light.black}`,
                                    padding: "5rem 1rem"
                                }}>
                                {NavigationComponents}
                            </SheetContent>
                        </Sheet>
                    </MobileNav>
                </LayoutContainer>
            </ShadowBox>
        </NavPageShell>
    )
}

export default NavigationBar;
