import ShadowBox from '@/components/ShadowBox'
import DotBackground from '@/components/DotBackground'
import PageContainerHeader from './PageContainerHeader'
import type { HeaderActions, HeaderText } from './PageContainerHeader'


interface ContainerProps {
    children: React.ReactNode
    headerText?: HeaderText
    headerActions?: HeaderActions
    bodyText?: string
}

// TODO: move to tailwind
export const HORIZONTAL_PADDING = 30;

const PageContainer: React.FC<ContainerProps> = ({ children, headerText, headerActions, bodyText = "" }) => {
    return (
        <div className="overall-container w-screen min-h-screen p-12 flex justify-center bg-content-background">
            {/* TODO: need to enforce this max-wdith via tailwind */}
            <div className="container-content w-full max-w-2200px">
                {/* TODO move to const along with the side padding */}
                <ShadowBox styles={{ content: { padding: '2rem 0' } }}>
                    <DotBackground />
                    <PageContainerHeader headerText={headerText} headerActions={headerActions} bodyText={bodyText} />
                    {children}
                </ShadowBox>
            </div>
        </div>
    )
}

export default PageContainer
