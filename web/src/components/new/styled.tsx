import styled from "@emotion/styled";


export const DotBackground = styled.div`
    z-index: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: calc(var(--spacing) * 0);
    background: var(--bg-warm);
    // TODO: hook into theme colors
    background-image: radial-gradient(#ccc 1px, transparent 1px);
    background-size: 16px 16px;
`