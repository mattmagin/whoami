import styled from "@emotion/styled";
import { Text } from "../ui";

const LogoText = styled(Text)`
    font-size: 35px;
`

// TODO: fix
const Logo = () => {
    return (
        <LogoText variant="heroTitle">{`< Matt Magin />`}</LogoText>
    )
}

export default Logo;