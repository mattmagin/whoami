import { Mail, MapPin, Github, Linkedin, Terminal } from 'lucide-react'
import { ScrollArea, Separator, Text, Stack, Flex, Grid } from '@/components/ui'
import CopyButton from '@/components/CopyButton'
import ContactForm from '@/components/ContactForm'
import { useResume } from '@/hooks/queries'
import { useContent } from '@/providers/ContentProvider'

const Contact = () => {
  const { common, contact } = useContent()!
  const { data: resume } = useResume()

  return (
    <ScrollArea className="h-full">
      <Grid cols={{ base: 1, lg: 2 }} gap="xl">
        {/* Contact Form */}
        <Stack as="section" gap="lg">
          <Text variant="cardTitle" as="h2">
            {contact.sendMessage}
          </Text>
          <ContactForm />
        </Stack>

        {/* Contact Info */}
        <Stack as="section" gap="lg">
          <Text variant="cardTitle" as="h2">
            {contact.otherWays}
          </Text>

          <Stack gap="lg">
            {/* Email */}
            <a
              href={`mailto:${resume?.contact.email}`}
              className="rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
            >
              <Flex align="start" gap="md">
                <Flex align="center" justify="center" className="h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </Flex>
                <Stack gap="none">
                  <p className="font-medium">{contact.email}</p>
                  <Text variant="bodySmall">
                    {resume?.contact.email}
                  </Text>
                </Stack>
              </Flex>
            </a>

            {/* Location */}
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <Flex align="start" gap="md">
                <Flex align="center" justify="center" className="h-10 w-10 rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </Flex>
                <Stack gap="none">
                  <p className="font-medium">{contact.location}</p>
                  <Text variant="bodySmall">
                    {resume?.contact.location}
                  </Text>
                </Stack>
              </Flex>
            </div>

            {/* GitHub */}
            {resume?.contact.github && (
              <a
                href={`https://${resume.contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
              >
                <Flex align="start" gap="md">
                  <Flex align="center" justify="center" className="h-10 w-10 rounded-lg bg-primary/10 text-primary">
                    <Github className="h-5 w-5" />
                  </Flex>
                  <Stack gap="none">
                    <p className="font-medium">GitHub</p>
                    <Text variant="bodySmall">
                      {resume.contact.github}
                    </Text>
                  </Stack>
                </Flex>
              </a>
            )}

            {/* LinkedIn */}
            {resume?.contact.linkedin && (
              <a
                href={`https://${resume.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/30"
              >
                <Flex align="start" gap="md">
                  <Flex align="center" justify="center" className="h-10 w-10 rounded-lg bg-primary/10 text-primary">
                    <Linkedin className="h-5 w-5" />
                  </Flex>
                  <Stack gap="none">
                    <p className="font-medium">LinkedIn</p>
                    <Text variant="bodySmall">
                      {resume.contact.linkedin}
                    </Text>
                  </Stack>
                </Flex>
              </a>
            )}

            <Separator />

            {/* SSH */}
            <Stack gap="sm" className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
              <Flex align="center" gap="sm">
                <Terminal className="h-5 w-5 text-primary" />
                <p className="font-medium">{contact.preferTerminal}</p>
              </Flex>
              <Text variant="bodySmall">
                {contact.sshDescription}
              </Text>
              <Flex align="center" gap="xs" className="rounded bg-muted pl-3 pr-1 py-1">
                <code className="flex-1 font-mono text-sm">
                  {common.sshCommand}
                </code>
                <CopyButton text={common.sshCommand} className="h-8 w-8" />
              </Flex>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </ScrollArea>
  )
}

export default Contact
