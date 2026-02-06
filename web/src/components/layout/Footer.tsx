import { Github, Linkedin, Mail, Terminal } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import CopyButton from '@/components/CopyButton'
import { useStrings } from '@/content'

const socialLinks = [
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:hello@example.com', icon: Mail, label: 'Email' },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { common, footer } = useStrings()

  return (
    <footer className="border-t border-border/50 bg-background transition-theme">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* SSH Access */}
          <div className="flex items-center gap-1 rounded-lg bg-muted/50 pl-4 pr-1 py-1 font-mono text-sm text-muted-foreground">
            <Terminal className="h-4 w-4 mr-1" />
            <span>{common.sshCommand}</span>
            <CopyButton text={common.sshCommand} className="h-8 w-8" />
          </div>

          <Separator className="max-w-xs" />

          {/* Social Links */}
          <div className="flex items-center gap-4">
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
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {footer.yourName}. {common.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
