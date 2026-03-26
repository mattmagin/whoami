import styled from "@emotion/styled";
import { Text } from "@/components/ui";
import { SectionContentContainer } from "@/App";

const AboutSectionContainer = styled.section`
        width: 100%;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;

const SectionContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 32px;
    padding: 0 200px;
`;

const AboutSection = () => {
    return (
        <AboutSectionContainer >
            <SectionContentContainer>
                <SectionContent>
                    {/* TOOD: make larger and grey */}
                    <Text variant="sectionTitle">A bit more about me</Text>
                </SectionContent>
            </SectionContentContainer >

        </AboutSectionContainer >
    );
};

export default AboutSection;