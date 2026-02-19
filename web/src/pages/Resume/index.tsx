import { Download } from 'lucide-react'
import { Button, Flex, Separator, Stack } from '@/components/ui'
import PageHeader from '@/components/PageHeader'
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
  const { data: resumeData, isLoading: resumeLoading, error, refetch } = useResume()

  if (resumeLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <ErrorState
        statusCode={isApiError(error) ? error.status : undefined}
        detail={isApiError(error) ? error.detail : undefined}
        onRetry={() => refetch()}
      />
    )
  }

  if (!resumeData) {
    return <ErrorState onRetry={() => refetch()} />
  }

  const { contact, summary, skills, experience, projects, education, certifications, interests } = resumeData

  return (
    <>
      <PageHeader title={resumeData.name} description={resumeData.title} />
      <Flex justify="end" className="mb-6">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </Flex>
      <Stack as="article" gap="xl">
        <Header contact={contact} />
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
    </>
  )
}

export default Resume
