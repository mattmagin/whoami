import { PageContent as Content } from "@/components/layout";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Grid from "../Grid";

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;
const SkeletonBlock = styled.div<{ $w?: string; $h?: string }>`
  width: ${(p) => p.$w ?? "100%"};
  height: ${(p) => p.$h ?? "18px"};
  background-color: #e0dbd7;
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingSkeleton = () => {
    const skeletonBlocks = Array.from({ length: 4 }).map(() => ({ $h: "260px" }));

    return (
        <Content>
            <SkeletonBlock $w="200px" $h="32px" />
            <Grid elements={skeletonBlocks} Component={SkeletonBlock} />
        </Content>
    );
};

export default LoadingSkeleton; 