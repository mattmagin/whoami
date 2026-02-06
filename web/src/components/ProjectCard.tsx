import { ExternalLink, Github } from 'lucide-react'
import Tilt from 'react-parallax-tilt'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Project } from '@/data/types'
import { useStrings } from '@/content'

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { common } = useStrings()

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      glareEnable={true}
      glareMaxOpacity={0.1}
      glareColor="#4a7c59"
      glarePosition="all"
      glareBorderRadius="0.5rem"
      transitionSpeed={300}
      gyroscope={false}
      className="h-full"
    >
      <article className="group h-full rounded-lg border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm">
        {/* Header */}
        <div className="mb-4">
          {project.featured && (
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
              {common.featured}
            </Badge>
          )}
          <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
            {project.name}
          </h3>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs font-mono">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                {common.code}
              </a>
            </Button>
          )}
          {project.url && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {common.liveDemo}
              </a>
            </Button>
          )}
        </div>
      </article>
    </Tilt>
  )
}

export default ProjectCard
