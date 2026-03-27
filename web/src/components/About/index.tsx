import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Text, Button } from "@/components/ui";
import { Badge } from "@/components/Badge";
import ShadowBox from "@/components/ShadowBox";
import { Theme } from "@/components/theme";
import { useResume } from "@/hooks";

const ACCENT = Theme.colors.dark.green;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: start;
`;

const BioColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SkillsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SkillGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
`;

const SkillGroupLabel = styled.span`
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${Theme.colors.dark.heading};
  margin-bottom: 4px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const InterestsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CurrentlyBox = styled.div`
  padding: 24px;
`;

const SkeletonBlock = styled.div<{ $w?: string; $h?: string }>`
  width: ${(p) => p.$w ?? "100%"};
  height: ${(p) => p.$h ?? "18px"};
  background-color: #e0dbd7;
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const SKILL_COLORS = [
  Theme.colors.dark.green,
  Theme.colors.dark.blue,
  Theme.colors.dark.orange,
  Theme.colors.dark.purple,
  Theme.colors.dark.pink,
  Theme.colors.dark.yellow,
];
const About: React.FC = () => {
  const { data: resume, isLoading, isError, refetch } = useResume();

  return (
    <>
      <Text variant="sectionTitle" style={{ color: ACCENT }}>
        A bit more about me
      </Text>

      <TwoCol>
        <BioColumn>
          {resume.summary && (
            <Text variant="body">{resume.summary}</Text>
          )}

          <ShadowBox
            backgroundColor={ACCENT}
            offset="xsm"
          >
            <CurrentlyBox>
              <Text
                variant="cardTitle"
                style={{ marginBottom: 8, color: Theme.colors.dark.heading }}
              >
                What I&apos;m working on
              </Text>
              <Text variant="body" style={{ color: Theme.colors.dark.heading }}>
                Building this portfolio site with a neubrutalism design
                system, a Rust TUI you can SSH into, and exploring
                homelab infrastructure.
              </Text>
            </CurrentlyBox>
          </ShadowBox>
        </BioColumn>

        <SkillsColumn>
          {Object.entries(resume.skills).map(
            ([category, items], idx) => (
              <ShadowBox
                key={category}
                offset="xsm"
                backgroundColor={Theme.colors.dark.contentBackground}
              >
                <SkillGroup>
                  <SkillGroupLabel>{category}</SkillGroupLabel>
                  <ChipRow>
                    {items.map((skill) => (
                      <Badge
                        key={skill}
                        style={{
                          backgroundColor:
                            SKILL_COLORS[idx % SKILL_COLORS.length],
                          borderColor: Theme.colors.dark.borderOutline,
                          color: Theme.colors.dark.heading,
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </ChipRow>
                </SkillGroup>
              </ShadowBox>
            )
          )}
        </SkillsColumn>
      </TwoCol>

      {resume.interests.length > 0 && (
        <div>
          <Text
            variant="cardTitle"
            style={{ marginBottom: 16, color: Theme.colors.dark.heading }}
          >
            Interests
          </Text>
          <InterestsRow>
            {resume.interests.map((interest) => (
              <ShadowBox key={interest} offset="xxsm">
                <div style={{ padding: "6px 16px" }}>
                  <Text variant="bodySmall" style={{ color: Theme.colors.dark.heading, fontWeight: 600 }}>
                    {interest}
                  </Text>
                </div>
              </ShadowBox>
            ))}
          </InterestsRow>
        </div>
      )}
    </>
  );
};

export default About;
