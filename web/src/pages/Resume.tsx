import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ResumeRenderer from '@/components/ResumeRenderer'
import { useStrings } from '@/content'
import resumeContent from '@/content/resume.md?raw'

const Resume = () => {
  const { resume: resumeStrings } = useStrings()

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
