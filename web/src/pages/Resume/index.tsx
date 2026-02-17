import { useEffect } from 'react'
import { Download } from 'lucide-react'
import { Button, Flex, ScrollArea, Separator, Stack } from '@/components/ui'
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
  const { resume: resumeStrings, setPageHeader } = useContent()!
  const { data: resumeData, isLoading: resumeLoading, error, refetch } = useResume()

  // Override the default strings.json heading with the user's name/title from the API
  useEffect(() => {
    if (resumeData) {
      setPageHeader(resumeData.name, resumeData.title)
    }
  }, [resumeData, setPageHeader])

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
    <ScrollArea className="h-full">
      <Flex justify="end" className="mb-6">
        <Button>
          <Download className="mr-2 h-4 w-4" />
          {resumeStrings.downloadPdf}
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
    </ScrollArea>
  )
}

export default Resume
