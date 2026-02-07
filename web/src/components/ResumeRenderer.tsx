import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, MapPin, Github, Linkedin } from 'lucide-react'
import type { ResumeData } from '@/types'

interface ResumeRendererProps {
    data: ResumeData
}

const ResumeRenderer = ({ data }: ResumeRendererProps) => {
    // Guard against invalid/cached data
    if (!data?.contact) {
        return <div className="text-muted-foreground">Loading resume data...</div>
    }

    return (
        <article className="space-y-12">
            {/* Header */}
            <header className="space-y-4">
                <h1 className="font-serif text-4xl font-bold tracking-tight">
                    {data.name}
                </h1>
                <p className="text-xl text-muted-foreground">{data.title}</p>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {data.contact.location}
                    </span>
                    <a
                        href={`mailto:${data.contact.email}`}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <Mail className="h-4 w-4" />
                        {data.contact.email}
                    </a>
                    <a
                        href={`https://${data.contact.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <Github className="h-4 w-4" />
                        {data.contact.github}
                    </a>
                    <a
                        href={`https://${data.contact.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <Linkedin className="h-4 w-4" />
                        {data.contact.linkedin}
                    </a>
                </div>
            </header>

            <Separator />

            {/* Summary */}
            <section>
                <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
                    Summary
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                    {data.summary}
                </p>
            </section>

            <Separator />

            {/* Skills */}
            <section>
                <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
                    Skills
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(data.skills).map(([category, skills]) => (
                        <div key={category}>
                            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="font-mono text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Separator />

            {/* Experience */}
            <section>
                <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
                    Experience
                </h2>
                <div className="space-y-8">
                    {data.experience.map((exp) => (
                        <div key={`${exp.company}-${exp.title}`}>
                            <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary/50">
                                <h3 className="font-semibold text-foreground">{exp.title}</h3>
                            </div>
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between pl-6 mt-1">
                                <p className="text-muted-foreground">
                                    {exp.company} • {exp.location}
                                </p>
                                <span className="text-sm text-muted-foreground">{exp.dates}</span>
                            </div>
                            <ul className="mt-3 space-y-1 pl-6">
                                {exp.highlights.map((highlight, i) => (
                                    <li key={i} className="text-sm text-muted-foreground before:mr-2 before:content-['•']">
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <Separator />

            {/* Projects */}
            <section>
                <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
                    Projects
                </h2>
                <div className="space-y-6">
                    {data.projects.map((project) => (
                        <div key={project.name}>
                            <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary/50">
                                <h3 className="font-semibold text-foreground">{project.name}</h3>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground pl-6">
                                {project.description}
                            </p>
                            <div className="mt-2 pl-6 flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="text-xs">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Separator />

            {/* Education */}
            <section>
                <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
                    Education
                </h2>
                <div className="space-y-6">
                    {data.education.map((edu) => (
                        <div key={edu.institution}>
                            <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary/50">
                                <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                            </div>
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between pl-6 mt-1">
                                <p className="text-muted-foreground">
                                    {edu.institution} • {edu.location}
                                </p>
                                <span className="text-sm text-muted-foreground">{edu.dates}</span>
                            </div>
                            {edu.details && edu.details.length > 0 && (
                                <ul className="mt-3 space-y-1 pl-6">
                                    {edu.details.map((detail, i) => (
                                        <li key={i} className="text-sm text-muted-foreground before:mr-2 before:content-['•']">
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <Separator />

            {/* Certifications */}
            <section>
                <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
                    Certifications
                </h2>
                <ul className="space-y-1 pl-6">
                    {data.certifications.map((cert) => (
                        <li key={cert.name} className="text-sm text-muted-foreground before:mr-2 before:content-['•']">
                            {cert.name} ({cert.year})
                        </li>
                    ))}
                </ul>
            </section>

            <Separator />

            {/* Interests */}
            <section>
                <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
                    Interests
                </h2>
                <p className="text-muted-foreground">
                    {data.interests.join(' • ')}
                </p>
            </section>
        </article>
    )
}

export default ResumeRenderer
