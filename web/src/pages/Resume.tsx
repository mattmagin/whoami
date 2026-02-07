import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ResumeRenderer from '@/components/ResumeRenderer'
import { useStrings } from '@/content'
import { useResume } from '@/hooks/queries'

const Resume = () => {
  const { resume: resumeStrings } = useStrings()
  const { data: resumeContent, isLoading: resumeLoading } = useResume()

  // TODO: make these look nicer
  // TODO: we have an inital flash of loading before the resume is loaded, need fix and make nicer..
  if (resumeLoading) {
    return <div>Loading...</div>
  }

  if (!resumeContent) {
    return <div>No resume content found</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header with Download Button */}
      <div className="flex justify-end mb-6">
        <Button className="w-fit">
          <Download className="mr-2 h-4 w-4" />
          {resumeStrings.downloadPdf}
        </Button>
      </div>

      {/* Resume Content from Markdown */}
      <ResumeRenderer content={resumeContent} />
    </div>
  )
}

export default Resume
