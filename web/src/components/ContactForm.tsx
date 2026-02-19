import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Button, Input, Label, Textarea, Text, Stack, Flex, Grid } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCreateContact } from '@/hooks'
import { CONTACT_LIMITS, contactSchema, type ContactFormValues } from '@/consts'

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
  const [serverError, setServerError] = useState<string | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { mutate, isPending: isSubmitting } = useCreateContact()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', message: '' },
  })

  const triggerConfetti = () => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

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

  // Determine which field should show the tooltip (first error in order)
  const fieldOrder: (keyof ContactFormValues)[] = ['name', 'email', 'message']
  const firstErrorField = fieldOrder.find(field => errors[field])

  /** Character count display for the message field */
  const messageValue = watch('message')
  const messageLength = messageValue.trim().length
  const messageNearLimit = messageLength > CONTACT_LIMITS.message * 0.9
  const messageOverLimit = messageLength > CONTACT_LIMITS.message

  const onSubmit = (data: ContactFormValues) => {
    setServerError(null)

    mutate(data, {
      onSuccess: () => {
        setSubmitted(true)
        triggerConfetti()
      },
      onError: () => {
        setServerError('Something went wrong. Please try again.')
      },
    })
  }

  if (submitted) {
    return (
      <Stack align="center" gap="md" className="rounded-lg border border-primary/20 bg-primary/5 p-8">
        <CheckCircle className="h-12 w-12 text-primary" />
        <Text variant="cardTitle">Message Sent!</Text>
        <Text variant="muted">
          Thanks for reaching out. I'll get back to you soon.
        </Text>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </Button>
      </Stack>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="lg">
        <Grid cols={{ base: 1, sm: 2 }} gap="lg">
          <Stack gap="xs">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Your name"
                maxLength={CONTACT_LIMITS.name}
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('name')}
              />
              <ValidationTooltip message={firstErrorField === 'name' ? errors.name?.message : undefined} id="name-error" />
            </div>
          </Stack>
          <Stack gap="xs">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                maxLength={CONTACT_LIMITS.email}
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('email')}
              />
              <ValidationTooltip message={firstErrorField === 'email' ? errors.email?.message : undefined} id="email-error" />
            </div>
          </Stack>
        </Grid>

        <Stack gap="xs">
          <Flex justify="between" align="center">
            <Label htmlFor="message">Message</Label>
            {messageNearLimit && (
              <Text
                variant="muted"
                className={`text-xs tabular-nums ${messageOverLimit ? 'text-destructive' : ''}`}
              >
                {messageLength.toLocaleString()}/{CONTACT_LIMITS.message.toLocaleString()}
              </Text>
            )}
          </Flex>
          <div className="relative">
            <Textarea
              id="message"
              placeholder="What would you like to discuss?"
              rows={6}
              disabled={isSubmitting}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={`resize-none ${errors.message ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              {...register('message')}
            />
            <ValidationTooltip message={firstErrorField === 'message' ? errors.message?.message : undefined} id="message-error" />
          </div>
        </Stack>

        {serverError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <Button
          ref={buttonRef}
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-fit"
        >
          {isSubmitting ? (
            'Sending...'
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </Stack>
    </form>
  )
}

export default ContactForm
