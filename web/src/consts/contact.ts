import { z } from 'zod'

export const CONTACT_LIMITS = {
    name: 200,
    email: 320,
    message: 5000,
} as const

export const contactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Please enter your name')
        .max(CONTACT_LIMITS.name, `Name must be ${CONTACT_LIMITS.name} characters or fewer`),
    email: z
        .string()
        .trim()
        .min(1, 'Please enter your email address')
        .max(CONTACT_LIMITS.email, `Email must be ${CONTACT_LIMITS.email} characters or fewer`)
        .email('Please enter a valid email address'),
    message: z
        .string()
        .trim()
        .min(1, 'Please enter a message')
        .max(CONTACT_LIMITS.message, `Message must be ${CONTACT_LIMITS.message.toLocaleString()} characters or fewer`),
})

export type ContactFormValues = z.infer<typeof contactSchema>
