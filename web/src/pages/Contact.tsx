import { Mail, MapPin, Github, Linkedin, Terminal } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import CopyButton from '@/components/CopyButton'
import ContactForm from '@/components/ContactForm'
import { useResume } from '@/hooks/queries'
import { useStrings } from '@/content'

const Contact = () => {
  const { common, contact } = useStrings()
  const { data: resume } = useResume()

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight">
          {contact.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {contact.description}
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <section>
          <h2 className="mb-6 font-serif text-xl font-semibold">
            {contact.sendMessage}
          </h2>
          <ContactForm />
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="mb-6 font-serif text-xl font-semibold">
            {contact.otherWays}
          </h2>

          <div className="space-y-6">
            {/* Email */}
            <a
              href={`mailto:${resume?.contact.email}`}
              className="flex items-start gap-4 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{contact.email}</p>
                <p className="text-sm text-muted-foreground">
                  {resume?.contact.email}
                </p>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-start gap-4 rounded-lg border border-border/50 bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{contact.location}</p>
                <p className="text-sm text-muted-foreground">
                  {resume?.contact.location}
                </p>
              </div>
            </div>

            {/* GitHub */}
            {resume?.contact.github && (
              <a
                href={`https://${resume.contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">GitHub</p>
                  <p className="text-sm text-muted-foreground">
                    {resume.contact.github}
                  </p>
                </div>
              </a>
            )}

            {/* LinkedIn */}
            {resume?.contact.linkedin && (
              <a
                href={`https://${resume.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <p className="text-sm text-muted-foreground">
                    {resume.contact.linkedin}
                  </p>
                </div>
              </a>
            )}

            <Separator />

            {/* SSH */}
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Terminal className="h-5 w-5 text-primary" />
                <p className="font-medium">{contact.preferTerminal}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {contact.sshDescription}
              </p>
              <div className="flex items-center gap-1 rounded bg-muted pl-3 pr-1 py-1">
                <code className="flex-1 font-mono text-sm">
                  {common.sshCommand}
                </code>
                <CopyButton text={common.sshCommand} className="h-8 w-8" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contact
