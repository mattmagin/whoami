import { Download } from 'lucide-react'
import { Button, Flex, Container, Separator, Stack } from '@/components/ui'
import { useContent } from '@/providers/ContentProvider'
import { useResume } from '@/hooks/queries'
import ErrorState from '@/components/ErrorState'
import { isApiError } from '@/api'
import Header from './Header'
import Summary from './Summary'
import Skills from './Skills'
import Experience from './Experience'
import Projects from './Projects'
import Education from './Education'
import Certifications from './Certifications'
import Interests from './Interests'

const Resume = () => {
  const { resume: resumeStrings } = useContent()
  const { data: resumeData, isLoading: resumeLoading, error, refetch } = useResume()

  // TODO: make these look nicer
  // TODO: we have an inital flash of loading before the resume is loaded, need fix and make nicer..
  if (resumeLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <Container size="md" padding="lg">
        <ErrorState
          statusCode={isApiError(error) ? error.status : undefined}
          detail={isApiError(error) ? error.detail : undefined}
          onRetry={() => refetch()}
        />
      </Container>
    )
  }

  if (!resumeData) {
    return (
      <Container size="md" padding="lg">
        <ErrorState onRetry={() => refetch()} />
      </Container>
    )
  }

  const { name, title, contact, summary, skills, experience, projects, education, certifications, interests } = resumeData

  return (
    <Container size="md" padding="lg">
      <Flex justify="end" className="mb-6">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          {resumeStrings.downloadPdf}
        </Button>
        <Stack as="article" gap="xl">
          <Header name={name} title={title} contact={contact} />
          <Separator />
          <Summary summary={summary} />
          <Separator />
          <Skills skills={skills} />
          <Separator />
          <Experience experience={experience} />
          <Separator />
          <Projects projects={projects} />
          <Separator />
          <Education education={education} />
          <Separator />
          <Certifications certifications={certifications} />
          <Separator />
          <Interests interests={interests} />
        </Stack>
      </Flex>
    </Container>
  )
}

export default Resume
