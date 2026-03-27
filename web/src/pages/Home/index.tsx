import TypewriterText from '@/components/TypewriterText'
import { Text, Button } from '@/components/ui'
import styled from '@emotion/styled'
import { Badge } from '@/components/Badge'
import ShadowBox, { OFFSET_STYLES } from '@/components/ShadowBox'
import { Theme } from '@/components/theme'
import { PageContent } from '@/components/layout'

const TYPEWRITER_STRINGS = [
  { text: 'Software Engineer.', style: { color: '#04e17a' } },
  { text: 'Powered By Coffee.', style: { color: '#FF7A05' } },
  { text: 'Tinkerer and Maker at Heart.', style: { color: '#0099FF' } },
  { text: 'Homelabber.', style: { color: '#FFBF00' } },
  { text: 'Open Source Enthusiast.', style: { color: '#9147ff' } },
]

const Left = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 40px;
`

const Right = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;  
  flex: 1;
  padding: 0 20px
`

const RightControl = styled.div`
  width: 80%;
  height: 100%;
`

const PROFILE_PHOTO_OFFSET = "sm"
const PROFILE_PHOTO_BORDER_RADIUS = 100;

const Home: React.FC = () => {
  return (
    <PageContent $css={{ flexDirection: 'row', marginTop: '200px', gap: '150px' }}>
      <Left>
        <div>
          <Text variant="heroTitle">HEY, I'M MATT</Text>
          <Text variant="sectionTitle" style={{ marginBottom: '20px' }}>
            <TypewriterText sequence={TYPEWRITER_STRINGS} />
          </Text>
          <Text variant="body">I'm a software engineer with a passion for building web applications and mobile apps. I'm a software engineer with a passion for building web applications and mobile apps. I'm a software engineer with a passion for building web applications and mobile apps.</Text>
        </div>
        <Button size="lg">
          Resume
        </Button>
        <Badge variant="default">Or try: ssh magin.tech</Badge>
      </Left>
      <Right>
        <RightControl>
          <ShadowBox backgroundColor={Theme.colors.light.purple} offset={PROFILE_PHOTO_OFFSET} styles={{ content: { borderRadius: `${PROFILE_PHOTO_BORDER_RADIUS}px 0` }, background: { borderRadius: `${PROFILE_PHOTO_BORDER_RADIUS + OFFSET_STYLES[PROFILE_PHOTO_OFFSET].borderThickness}px 0` } }}>
            insert photo here
          </ShadowBox>
        </RightControl>
      </Right>
    </PageContent>
  )
}

export default Home
