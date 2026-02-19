import { Mail, MapPin, Github, Linkedin } from 'lucide-react'
import { Text, Stack, Flex, Grid } from '@/components/ui'
import ContactForm from '@/components/ContactForm'
import PageHeader from '@/components/PageHeader'
import { useResume } from '@/hooks/queries'

const Contact = () => {
  const { data: resume } = useResume()

  return (
    <>
      <PageHeader title="Say Hello" description="Have a question, role opportunity, project idea or just want to say hello? I'd love to hear from you." />
      <Grid cols={{ base: 1, lg: 2 }} gap="xl">
        {/* Contact Form */}
        <Stack as="section" gap="lg">
          <Text variant="cardTitle" as="h2">
            Send a Message
          </Text>
          <ContactForm />
        </Stack>

        {/* Contact Info */}
        <Stack as="section" gap="lg">
          <Text variant="cardTitle" as="h2">
            Other Ways to Reach Me
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
                  <p className="font-medium">Email</p>
                  <Text variant="bodySmall">
                    {resume?.contact.email}
                  </Text>
                </Stack>
              </Flex>
            </a>


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

          </Stack>
        </Stack>
      </Grid>
    </>
  )
}

export default Contact
