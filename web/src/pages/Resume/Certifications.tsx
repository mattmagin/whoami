import { Text, Stack } from '@/components/ui'
import type { ResumeCertification } from '@/api'

interface CertificationsProps {
    certifications: ResumeCertification[]
}

const Certifications = ({ certifications = [] }: CertificationsProps) => {
    if (certifications.length === 0) {
        return null
    }

    return (
        <Stack as="section" gap="lg">
            <Text variant="sectionTitle">
                Certifications
            </Text>
            <Stack as="ul" gap="xs" className="pl-6">
                {certifications.map((cert) => (
                    <Text key={cert.name} variant="bodySmall" as="li" className="before:mr-2 before:content-['•']">
                        {cert.name} ({cert.year})
                    </Text>
                ))}
            </Stack>
        </Stack>
    )
}

export default Certifications
