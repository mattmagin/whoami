import { Github, Linkedin, Mail, Terminal } from 'lucide-react'
import { Separator, Text, Stack, Flex, Container } from '@/components/ui'
import CopyButton from '@/components/CopyButton'
import { useContent } from '@/providers/ContentProvider'

const socialLinks = [
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:hello@example.com', icon: Mail, label: 'Email' },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { common, footer } = useContent()

  return (
    <footer className="border-t border-border/50 bg-background transition-theme">
      <Container size="lg" padding="md">
        <Stack align="center" gap="lg">
          {/* SSH Access */}
          <Flex align="center" gap="xs" className="rounded-lg bg-muted/50 pl-4 pr-1 py-1 font-mono text-sm text-muted-foreground">
            <Terminal className="h-4 w-4" />
            <span>{common.sshCommand}</span>
            <CopyButton text={common.sshCommand} className="h-8 w-8" />
          </Flex>

          <Separator className="max-w-xs" />

          {/* Social Links */}
          <Flex align="center" gap="md">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </Flex>

          {/* Copyright */}
          <Text variant="bodySmall">
            &copy; {currentYear} {footer.yourName}. {common.copyright}
          </Text>
        </Stack>
      </Container>
    </footer>
  )
}

export default Footer
