import styled from "@emotion/styled";
import { Text } from "@/components/ui";
import ShadowBox from "./ShadowBox";
import { Theme } from "./theme";
import { HORIZONTAL_PADDING } from "./Container";
import Logo from "./Logo";
import { Github, Linkedin, Mail } from "lucide-react";
import { useResume } from "@/hooks";

const Outer = styled.footer`
  width: 100%;
  padding: 0 ${HORIZONTAL_PADDING}px;
  margin-top: auto;
`;

const Inner = styled.div`
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 12px;
`;

const IconLink = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Theme.colors.dark.heading};
  transition: color 0.15s ease;

  &:hover {
    color: ${Theme.colors.dark.green};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 3px solid ${Theme.colors.dark.borderOutline};
  margin: 0;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Footer = () => {
  const { data: resume } = useResume();
  const contact = resume?.contact;
  const year = new Date().getFullYear();

  return (
    <Outer>
      <ShadowBox
        backgroundColor={Theme.colors.dark.yellow}
        offset="xsm"
      >
        <Inner>
          <TopRow>
            <Logo />
            <SocialRow>
              {contact?.email && (
                <ShadowBox offset="xxsm" backgroundColor="#ffffff">
                  <IconLink href={`mailto:${contact.email}`} aria-label="Email">
                    <Mail size={18} />
                  </IconLink>
                </ShadowBox>
              )}
              {contact?.github && (
                <ShadowBox offset="xxsm" backgroundColor="#ffffff">
                  <IconLink
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <Github size={18} />
                  </IconLink>
                </ShadowBox>
              )}
              {contact?.linkedin && (
                <ShadowBox offset="xxsm" backgroundColor="#ffffff">
                  <IconLink
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </IconLink>
                </ShadowBox>
              )}
            </SocialRow>
          </TopRow>

          <Divider />

          <BottomRow>
            <Text variant="bodySmall" style={{ color: Theme.colors.dark.heading, fontWeight: 600 }}>
              &copy; {year} Matt Magin. Built with Bun, Hono &amp; React.
            </Text>
            <Text variant="bodySmall" style={{ color: Theme.colors.dark.body }}>
              Designed with neubrutalism in mind.
            </Text>
          </BottomRow>
        </Inner>
      </ShadowBox>
    </Outer>
  );
};

export default Footer;
