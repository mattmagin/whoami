import type { CSSProperties } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Text, Button } from "@/components/ui";
import { Badge } from "@/components/Badge";
import ShadowBox from "@/components/ShadowBox";
import { Theme } from "@/components/theme";
import { STATIC_RESUME_EXPERIENCE } from "@/consts/resumeExperience";
import { useResume } from "@/hooks";
import { cn } from "@/lib/utils";
import PageHeading from "../Text/PageHeading";
import { DownloadIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTE_DEFINITIONS, ROUTE } from "@/consts";

/** WCAG AA–friendly saturated red-orange on white (~5.5:1) */
const RESUME_PAGE_TITLE = "#C41E1C";
/** Primary copy on white / pale cards */
const RESUME_TEXT = "#000000";
const CARD_BG = "#FFFFFF";
const TIMELINE_STROKE = "#000000";

const resumePageTitleStyle = {
  color: RESUME_PAGE_TITLE,
  fontWeight: 800 as const,
} satisfies CSSProperties;

const resumeSectionHeaderStyle = {
  color: RESUME_TEXT,
  fontWeight: 800 as const,
} satisfies CSSProperties;

const resumeJobTitleStyle = {
  color: RESUME_TEXT,
  fontWeight: 800 as const,
} satisfies CSSProperties;

const resumeBodyStyle = {
  color: RESUME_TEXT,
} satisfies CSSProperties;

const resumeBodySmallStyle = {
  color: RESUME_TEXT,
  fontWeight: 500 as const,
} satisfies CSSProperties;

const resumeCompanyStyle = {
  color: RESUME_TEXT,
  fontWeight: 600 as const,
} satisfies CSSProperties;

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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SubSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/** Below 2000px: experience then skills stacked. At ultra-wide: skills sit to the right of experience. */
const ExperienceSkillsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;

  @media (min-width: 2000px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
    column-gap: 56px;
    row-gap: 0;
    align-items: start;
  }
`;

const SkillsAside = styled.div`
  @media (min-width: 2000px) {
    // position: sticky;
  // TODO: refactor to use flexbox / grid rather than an absolute position
    top: 1.5rem;
    max-height: calc(100vh - 3rem);
    overflow-y: auto;
  }
`;

/* ── Timeline (blueprint rail: date callout | track + line | card) ── */

const TIMELINE_DOT_TOP_PX = 22;

const Timeline = styled.div`
  --resume-date-rail: 12rem;
  --resume-gap-date-track: 1rem;
  --resume-track: 54px;
  /* Breathing room between markers and cards; must stay in sync with grid margins below */
  --resume-gap-track-card: 2rem;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-left: 0;

  @media (max-width: 480px) {
    --resume-date-rail: 9.5rem;
    --resume-gap-date-track: 0.75rem;
    --resume-gap-track-card: 1.5rem;
  }

  &::before {
    content: "";
    position: absolute;
    left: calc(
      var(--resume-date-rail) +
        var(--resume-track) / 2 - 1px
    );
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: ${TIMELINE_STROKE};
    box-sizing: border-box;
    pointer-events: none;
  }
`;

const TimelineItem = styled.div`
  position: relative;
  display: grid;
  /* Fixed date rail width must match ::before calc — minmax(0, 12rem) was narrower than calc, sliding the line under cards */
  grid-template-columns:
    var(--resume-date-rail)
    var(--resume-track)
    minmax(0, 1fr);
  column-gap: 0;
  align-items: start;
`;

const TimelineCardCell = styled.div`
  min-width: 0;
`;

const TimelineDateCell = styled.div`
  margin-right: var(--resume-gap-date-track);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: ${TIMELINE_DOT_TOP_PX}px;
  min-height: ${24 + TIMELINE_DOT_TOP_PX}px;
  box-sizing: border-box;
`;

const TimelineTrackCell = styled.div`
  position: relative;
  margin-right: var(--resume-gap-track-card);
  width: var(--resume-track);
  min-width: var(--resume-track);
  flex-shrink: 0;
`;

const TimelineDot = styled.div<{ $color: string }>`
  position: absolute;
  left: 50%;
  top: ${TIMELINE_DOT_TOP_PX}px;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  box-sizing: border-box;
  background-color: ${(p) => p.$color};
  border: 2px solid ${TIMELINE_STROKE};
`;

const DateRangeCallout: React.FC<{ children: string }> = ({ children }) => (
  <span
    className={cn(
      "inline-block max-w-full text-right font-mono text-xs font-bold uppercase leading-tight tracking-wide text-black",
      "border-2 border-black bg-white px-2 py-1",
      "shadow-[4px_4px_0_0_#000]",
      "break-words",
    )}
  >
    {children}
  </span>
);

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
  color: ${RESUME_TEXT};
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

/** In the wide two-column layout, skill groups stack in one column in the right rail. */
const SkillCategoryGridWide = styled(SkillCategoryGrid)`
  @media (min-width: 2000px) {
    grid-template-columns: 1fr;
  }
`;

const SkillGroupBox = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkillGroupLabel = styled.span`
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${RESUME_TEXT};
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

/* ── Education / Certs grid ── */

const EduCertGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
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
    <>
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError || !resume ? (
        <Content style={{ alignItems: "center" }}>
          <Text variant="body" style={resumeBodyStyle}>
            Failed to load resume.
          </Text>
          <Button variant="ghost" onClick={() => refetch()}>
            Retry
          </Button>
        </Content>
      ) : (
        <Content>
          <div className="mb-8 gap-8 flex flex-col">
            <div className="flex justify-between items-center">
              <PageHeading styledText="Resume" />
              <Button variant="primary" size="sm" asChild>
                <Link to={ROUTE_DEFINITIONS[ROUTE.RESUME_PDF].path}>
                  Download Resume
                  <DownloadIcon size={16} />
                </Link>
              </Button>
            </div>
            <Text variant="body">
              Full-Stack Software Engineer driving end-to-end feature delivery in enterprise SaaS, specialising in React, TypeScript, Node.js, and Ruby on Rails. Focused on translating customer needs into high-impact product outcomes. I maintain a deep commitment to product quality through clean and maintainable code whilst maximising developer velocity. This coupled with effectively leveraging AI-powered tooling to enhance my workflows and maintain a focused, productive state. Proven ability to transition from a customer-facing professional services department to core platform engineering.
            </Text>
          </div>

          {(STATIC_RESUME_EXPERIENCE.length > 0 ||
            Object.keys(resume.skills).length > 0) && (
              <ExperienceSkillsLayout>
                {/* ── Experience ── */}
                {STATIC_RESUME_EXPERIENCE.length > 0 && (
                  <SubSection>
                    <Text variant="cardTitle" style={resumeSectionHeaderStyle}>
                      Experience
                    </Text>
                    <Timeline>
                      {STATIC_RESUME_EXPERIENCE.map((exp, idx) => (
                        <TimelineItem key={`${exp.company}-${exp.title}`}>
                          <TimelineDateCell>
                            <DateRangeCallout>{exp.dates}</DateRangeCallout>
                          </TimelineDateCell>
                          <TimelineTrackCell>
                            <TimelineDot
                              $color={
                                TIMELINE_COLORS[idx % TIMELINE_COLORS.length]
                              }
                            />
                          </TimelineTrackCell>
                          <TimelineCardCell>
                            <ShadowBox
                              offset="xsm"
                              backgroundColor={CARD_BG}
                            >
                              <CardInner>
                                <Text
                                  variant="cardTitle"
                                  style={resumeJobTitleStyle}
                                >
                                  {exp.title}
                                </Text>
                                <Text variant="body" style={resumeCompanyStyle}>
                                  {exp.company}
                                  {exp.location ? ` · ${exp.location}` : ""}
                                </Text>
                                {exp.highlights.length > 0 && (
                                  <HighlightList>
                                    {exp.highlights.map((h, hIdx) => (
                                      <Text
                                        key={hIdx}
                                        variant="bodySmall"
                                        as="li"
                                        style={resumeBodySmallStyle}
                                      >
                                        {h}
                                      </Text>
                                    ))}
                                  </HighlightList>
                                )}
                              </CardInner>
                            </ShadowBox>
                          </TimelineCardCell>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </SubSection>
                )}

                {/* ── Skills ── */}
                {Object.keys(resume.skills).length > 0 && (
                  <SkillsAside>
                    <SubSection>
                      <Text variant="cardTitle" style={resumeSectionHeaderStyle}>
                        Skills
                      </Text>
                      <SkillCategoryGridWide>
                        {Object.entries(resume.skills).map(
                          ([category, items], idx) => (
                            <ShadowBox
                              key={category}
                              offset="xsm"
                              backgroundColor={CARD_BG}
                            >
                              <SkillGroupBox>
                                <SkillGroupLabel>{category}</SkillGroupLabel>
                                <ChipRow>
                                  {items.map((skill) => (
                                    <Badge
                                      key={skill}
                                      style={{
                                        backgroundColor:
                                          SKILL_COLORS[
                                          idx % SKILL_COLORS.length
                                          ],
                                        borderColor: TIMELINE_STROKE,
                                        color: RESUME_TEXT,
                                        fontWeight: 600,
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
                      </SkillCategoryGridWide>
                    </SubSection>
                  </SkillsAside>
                )}
              </ExperienceSkillsLayout>
            )}

          {/* ── Education & Certifications ── */}
          {(resume.education.length > 0 ||
            resume.certifications.length > 0) && (
              <SubSection>
                <Text variant="cardTitle" style={resumeSectionHeaderStyle}>
                  Education &amp; Certifications
                </Text>
                <EduCertGrid>
                  {resume.education.map((edu) => (
                    <ShadowBox
                      key={`${edu.institution}-${edu.degree}`}
                      offset="xsm"
                      backgroundColor={CARD_BG}
                    >
                      <EduCard>
                        <Text variant="cardTitle" style={resumeJobTitleStyle}>
                          {edu.degree}
                        </Text>
                        <Text variant="body" style={resumeBodyStyle}>
                          {edu.institution}
                        </Text>
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
                      backgroundColor={CARD_BG}
                    >
                      <EduCard>
                        <Text variant="cardTitle" style={resumeJobTitleStyle}>
                          {cert.name}
                        </Text>
                        {cert.year && (
                          <DateLabel>{cert.year}</DateLabel>
                        )}
                      </EduCard>
                    </ShadowBox>
                  ))}
                </EduCertGrid>
              </SubSection>
            )}
        </Content>
      )}
    </>
  );
};

export default Resume;
