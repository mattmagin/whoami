import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Button, Input, Label, Textarea, Text, Stack, Flex, Grid } from '@/components/ui'
import { useContent } from '@/providers/ContentProvider'

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface FormValues {
  name: string
  email: string
  message: string
}

interface ValidationTooltipProps {
  message?: string
  id: string
}

const ValidationTooltip = ({ message, id }: ValidationTooltipProps) => {
  if (!message) return null

  return (
    <div
      id={id}
      role="alert"
      className="absolute left-0 top-full z-10 mt-2 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="relative rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground shadow-lg">
        {/* Arrow */}
        <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 bg-destructive" />
        <Flex align="center" gap="sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </Flex>
      </div>
    </div>
  )
}

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [values, setValues] = useState<FormValues>({ name: '', email: '', message: '' })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { contactForm } = useContent()

  function triggerConfetti() {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    // Subtle, tasteful confetti burst
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x, y },
      colors: ['#2d5a3d', '#4a7c59', '#8fbc8f', '#a8d5a2'],
      ticks: 150,
      gravity: 1.2,
      scalar: 0.9,
      disableForReducedMotion: true,
    })
  }

  const validateField = (name: keyof FormValues, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return contactForm.errors?.nameRequired
        return undefined
      case 'email':
        if (!value.trim()) return contactForm.errors?.emailRequired
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return contactForm.errors?.emailInvalid
        return undefined
      case 'message':
        if (!value.trim()) return contactForm.errors?.messageRequired
        return undefined
      default:
        return undefined
    }
  }

  const validateAll = (): FormErrors => {
    return {
      name: validateField('name', values.name),
      email: validateField('email', values.email),
      message: validateField('message', values.message),
    }
  }

  // Determine which field should show the tooltip (first error in order)
  const fieldOrder: (keyof FormErrors)[] = ['name', 'email', 'message']
  const firstErrorField = fieldOrder.find(field => errors[field])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing (if field was touched)
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name as keyof FormValues, value) }))
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name as keyof FormValues, value) }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({ name: true, email: true, message: true })

    // Validate all fields
    const newErrors = validateAll()
    setErrors(newErrors)

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== undefined)) {
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      triggerConfetti()
    }, 1000)
  }

  if (submitted) {
    return (
      <Stack align="center" gap="md" className="rounded-lg border border-primary/20 bg-primary/5 p-8">
        <CheckCircle className="h-12 w-12 text-primary" />
        <Text variant="cardTitle">{contactForm.successTitle}</Text>
        <Text variant="muted">
          {contactForm.successDescription}
        </Text>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
        >
          {contactForm.sendAnother}
        </Button>
      </Stack>
    )
  }

  return (
    <Stack as="form" gap="lg" onSubmit={handleSubmit} noValidate>
      <Grid cols={{ base: 1, sm: 2 }} gap="lg">
        <Stack gap="xs">
          <Label htmlFor="name">{contactForm.nameLabel}</Label>
          <div className="relative">
            <Input
              id="name"
              name="name"
              placeholder={contactForm.namePlaceholder}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            <ValidationTooltip message={firstErrorField === 'name' ? errors.name : undefined} id="name-error" />
          </div>
        </Stack>
        <Stack gap="xs">
          <Label htmlFor="email">{contactForm.emailLabel}</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={contactForm.emailPlaceholder}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            <ValidationTooltip message={firstErrorField === 'email' ? errors.email : undefined} id="email-error" />
          </div>
        </Stack>
      </Grid>

      <Stack gap="xs">
        <Label htmlFor="message">{contactForm.messageLabel}</Label>
        <div className="relative">
          <Textarea
            id="message"
            name="message"
            placeholder={contactForm.messagePlaceholder}
            rows={6}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`resize-none ${errors.message ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          />
          <ValidationTooltip message={firstErrorField === 'message' ? errors.message : undefined} id="message-error" />
        </div>
      </Stack>

      <Button
        ref={buttonRef}
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-fit"
      >
        {isSubmitting ? (
          contactForm.sending
        ) : (
          <>
            {contactForm.sendButton}
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </Stack>
  )
}

export default ContactForm
