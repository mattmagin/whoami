import { Text, Stack, Flex } from '@/components/ui'
import { Mail, MapPin, Github, Linkedin } from 'lucide-react'
import type { ResumeContact } from '@/types'

interface HeaderProps {
    name: string
    title: string
    contact: ResumeContact
}

const Header = ({ name, title, contact }: HeaderProps) => {
    return (
        <Stack as="header" gap="sm">
            <Text variant="pageTitle">
                {name}
            </Text>
            <Text variant="subtitle">{title}</Text>

            {/* Contact Info */}
            <Flex gap="md" wrap className="text-sm text-muted-foreground">
                <Flex align="center" gap="xs">
                    <MapPin className="h-4 w-4" />
                    <span>{contact.location}</span>
                </Flex>
                <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-foreground transition-colors"
                >
                    <Flex align="center" gap="xs">
                        <Mail className="h-4 w-4" />
                        <span>{contact.email}</span>
                    </Flex>
                </a>
                <a
                    href={`https://${contact.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                >
                    <Flex align="center" gap="xs">
                        <Github className="h-4 w-4" />
                        <span>{contact.github}</span>
                    </Flex>
                </a>
                <a
                    href={`https://${contact.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                >
                    <Flex align="center" gap="xs">
                        <Linkedin className="h-4 w-4" />
                        <span>{contact.linkedin}</span>
                    </Flex>
                </a>
            </Flex>
        </Stack>
    )
}

export default Header
