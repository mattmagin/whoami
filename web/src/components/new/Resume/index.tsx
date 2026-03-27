import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Text, Button } from "@/components/ui";
import { Badge } from "@/components/new/Badge";
import ShadowBox from "@/components/new/ShadowBox";
import { Theme } from "@/components/new/theme";
import { SectionContainer } from "@/components/new/layout";
import { useResume } from "@/hooks";

const ACCENT = Theme.colors.dark.orange;

const TIMELINE_COLORS = [
  Theme.colors.dark.orange,
  Theme.colors.dark.blue,
  Theme.colors.dark.green,
  Theme.colors.dark.purple,
  Theme.colors.dark.pink,
  Theme.colors.dark.yellow,
];

const SKILL_COLORS = [
  Theme.colors.dark.blue,
  Theme.colors.dark.green,
  Theme.colors.dark.orange,
  Theme.colors.dark.pink,
  Theme.colors.dark.purple,
  Theme.colors.dark.yellow,
];

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const Section = styled.section`
  width: 100%;
  background-color: ${Theme.colors.dark.contentBackground};
  padding: 80px 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
`;

const SubSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* ── Timeline ── */

const Timeline = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-left: 36px;

  &::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: ${Theme.colors.dark.borderOutline};
  }
`;

const TimelineItem = styled.div`
  position: relative;
`;

const TimelineDot = styled.div<{ $color: string }>`
  position: absolute;
  left: -36px;
  top: 22px;
  width: 24px;
  height: 24px;
  background-color: ${(p) => p.$color};
  border: 4px solid ${Theme.colors.dark.borderOutline};
  z-index: 1;
`;

const CardInner = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${Theme.colors.dark.body};
`;

const HighlightList = styled.ul`
  margin: 8px 0 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/* ── Skills grid ── */

const SkillCategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

const SkillGroupBox = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkillGroupLabel = styled.span`
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${Theme.colors.dark.heading};
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

/* ── Education / Certs grid ── */

const EduCertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const EduCard = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/* ── Skeleton ── */

const SkeletonBlock = styled.div<{ $w?: string; $h?: string }>`
  width: ${(p) => p.$w ?? "100%"};
  height: ${(p) => p.$h ?? "18px"};
  background-color: #e0dbd7;
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingSkeleton = () => (
  <Content>
    <SkeletonBlock $w="200px" $h="32px" />
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonBlock key={i} $h="120px" />
    ))}
  </Content>
);

const Resume: React.FC = () => {
  const { data: resume, isLoading, isError, refetch } = useResume();

  return (
    <Section id="resume">
      <SectionContainer>
        {isLoading ? (
          <LoadingSkeleton />
        ) : isError || !resume ? (
          <Content style={{ alignItems: "center" }}>
            <Text variant="body">Failed to load resume.</Text>
            <Button variant="ghost" onClick={() => refetch()}>
              Retry
            </Button>
          </Content>
        ) : (
          <Content>
            <Text variant="sectionTitle" style={{ color: ACCENT }}>
              Resume
            </Text>

            {/* ── Experience ── */}
            {resume.experience.length > 0 && (
              <SubSection>
                <Text variant="cardTitle">Experience</Text>
                <Timeline>
                  {resume.experience.map((exp, idx) => (
                    <TimelineItem key={`${exp.company}-${exp.title}`}>
                      <TimelineDot
                        $color={TIMELINE_COLORS[idx % TIMELINE_COLORS.length]}
                      />
                      <ShadowBox offset="xsm">
                        <CardInner>
                          <Text variant="cardTitle">{exp.title}</Text>
                          <Text variant="body" style={{ fontWeight: 600 }}>
                            {exp.company}
                            {exp.location ? ` · ${exp.location}` : ""}
                          </Text>
                          <DateLabel>{exp.dates}</DateLabel>
                          {exp.highlights.length > 0 && (
                            <HighlightList>
                              {exp.highlights.map((h, hIdx) => (
                                <Text
                                  key={hIdx}
                                  variant="bodySmall"
                                  as="li"
                                >
                                  {h}
                                </Text>
                              ))}
                            </HighlightList>
                          )}
                        </CardInner>
                      </ShadowBox>
                    </TimelineItem>
                  ))}
                </Timeline>
              </SubSection>
            )}

            {/* ── Skills ── */}
            {Object.keys(resume.skills).length > 0 && (
              <SubSection>
                <Text variant="cardTitle">Skills</Text>
                <SkillCategoryGrid>
                  {Object.entries(resume.skills).map(
                    ([category, items], idx) => (
                      <ShadowBox key={category} offset="xsm">
                        <SkillGroupBox>
                          <SkillGroupLabel>{category}</SkillGroupLabel>
                          <ChipRow>
                            {items.map((skill) => (
                              <Badge
                                key={skill}
                                style={{
                                  backgroundColor:
                                    SKILL_COLORS[idx % SKILL_COLORS.length],
                                  borderColor:
                                    Theme.colors.dark.borderOutline,
                                  color: Theme.colors.dark.heading,
                                }}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </ChipRow>
                        </SkillGroupBox>
                      </ShadowBox>
                    )
                  )}
                </SkillCategoryGrid>
              </SubSection>
            )}

            {/* ── Education & Certifications ── */}
            {(resume.education.length > 0 ||
              resume.certifications.length > 0) && (
                <SubSection>
                  <Text variant="cardTitle">Education &amp; Certifications</Text>
                  <EduCertGrid>
                    {resume.education.map((edu) => (
                      <ShadowBox
                        key={`${edu.institution}-${edu.degree}`}
                        offset="xsm"
                        backgroundColor={Theme.colors.dark.yellow}
                      >
                        <EduCard>
                          <Text variant="cardTitle">{edu.degree}</Text>
                          <Text variant="body">{edu.institution}</Text>
                          {edu.dates && (
                            <DateLabel>{edu.dates}</DateLabel>
                          )}
                        </EduCard>
                      </ShadowBox>
                    ))}
                    {resume.certifications.map((cert) => (
                      <ShadowBox
                        key={cert.name}
                        offset="xsm"
                        backgroundColor={Theme.colors.dark.purple}
                      >
                        <EduCard>
                          <Text
                            variant="cardTitle"
                            style={{ color: "#fff" }}
                          >
                            {cert.name}
                          </Text>
                          {cert.year && (
                            <DateLabel style={{ color: "#ffffffcc" }}>
                              {cert.year}
                            </DateLabel>
                          )}
                        </EduCard>
                      </ShadowBox>
                    ))}
                  </EduCertGrid>
                </SubSection>
              )}
          </Content>
        )}
      </SectionContainer>
    </Section>
  );
};

export default Resume;
