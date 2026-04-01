import TypewriterText from '@/components/TypewriterText'
import { Text, Button } from '@/components/ui'
import styled from '@emotion/styled'
import { Badge } from '@/components/ui/badge'
import ShadowBox, { OFFSET_STYLES } from '@/components/ShadowBox'
import { Theme } from '@/components/theme'
import { PageContent } from '@/components/layout'
import { PAGE_SHELL_BREAKPOINT_PX } from '@/components/layout'
import { NavLink } from 'react-router-dom'

const TYPEWRITER_STRINGS = [
  { text: 'Software Engineer.', style: { color: '#04e17a' } },
  { text: 'Powered By Coffee.', style: { color: '#FF7A05' } },
  { text: 'Tinkerer and Maker at Heart.', style: { color: '#0099FF' } },
  { text: 'Homelabber.', style: { color: '#FFBF00' } },
  { text: 'Open Source Enthusiast.', style: { color: '#9147ff' } },
]

export const PAGE_MARGIN_TOP = "8rem";

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8rem;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-top: ${PAGE_MARGIN_TOP};


  @media (min-width: ${PAGE_SHELL_BREAKPOINT_PX}px) {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: start;
    gap: 8rem;
  }

  @media (max-width: 1400px) {
    gap: 4rem;
  }

  // @media (max-width: ${PAGE_SHELL_BREAKPOINT_PX}px) {
  //   gap: 4rem;
  // }
`

const IntroColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  min-width: 0;
`

const IntroColumnContent = styled.div`
  @media (max-width: ${PAGE_SHELL_BREAKPOINT_PX}px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center !important;
  }
`

const PhotoColumn = styled.div`
  width: 100%;
  min-width: 0;

    @media (max-width: ${PAGE_SHELL_BREAKPOINT_PX}px) {
      display: none;
    }
`

const PhotoFrame = styled.div`
  width: 100%;
  max-width: min(100%, 400px);
  margin-inline: auto;

  @media (min-width: 900px) {
    margin-inline: 0;
    margin-left: auto;
    max-width: 100%;
  }
`

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: ${PAGE_SHELL_BREAKPOINT_PX}px) {
    justify-content: center;
    align-items: center;
  }
`

const PROFILE_PHOTO_OFFSET = 'sm'
const PROFILE_PHOTO_BORDER_RADIUS = 100

const Home: React.FC = () => {
  return (
    <PageContent className="home-page">
      <HeroGrid className="hero-grid">
        <IntroColumn>
          <IntroColumnContent>
            <Text variant="heroTitle">HEY, I'M MATT</Text>
            <Text variant="sectionTitle" style={{ marginBottom: '20px' }}>
              <TypewriterText sequence={TYPEWRITER_STRINGS} />
            </Text>
            <Text variant="body" style={{ textAlign: 'justify' }}>
              I’m a tinkerer and maker at heart, and my weapon of choice is code. As a Full-Stack Software Engineer, I find joy in solving real-world problems through robust, well-architected systems. To me, software is an iterative process of problem solving where elegant design, logic, and user experience intersect. Ultimately, I focus on building high-velocity, maintainable solutions for the web that deliver tangible results to users.
            </Text>
          </IntroColumnContent>
          <Buttons>
            <NavLink to="/projects">
              <Button size="lg">Check out my projects</Button>
            </NavLink>
            <Badge style={{ fontSize: '0.85rem' }}>Or try: ssh magin.tech</Badge>
          </Buttons>
        </IntroColumn>
        <PhotoColumn>
          <PhotoFrame>
            <ShadowBox
              backgroundColor={Theme.colors.light.purple}
              offset={PROFILE_PHOTO_OFFSET}
              styles={{
                content: {
                  borderRadius: `${PROFILE_PHOTO_BORDER_RADIUS}px 0`,
                  minHeight: 'clamp(220px, 35vw, 340px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                background: {
                  borderRadius: `${PROFILE_PHOTO_BORDER_RADIUS + OFFSET_STYLES[PROFILE_PHOTO_OFFSET].borderThickness}px 0`,
                },
              }}
            >
              <Text variant="bodySmall" style={{ color: Theme.colors.dark.heading, opacity: 0.85 }}>
                insert photo here
              </Text>
            </ShadowBox>
          </PhotoFrame>
        </PhotoColumn>
      </HeroGrid>
    </PageContent>
  )
}

export default Home
