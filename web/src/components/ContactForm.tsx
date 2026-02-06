import { useState, useRef, type FormEvent } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useStrings } from '@/content'

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { contactForm } = useStrings()

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
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
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h3 className="mb-2 font-serif text-xl font-semibold">{contactForm.successTitle}</h3>
        <p className="text-muted-foreground">
          {contactForm.successDescription}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          {contactForm.sendAnother}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{contactForm.nameLabel}</Label>
          <Input
            id="name"
            name="name"
            placeholder={contactForm.namePlaceholder}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{contactForm.emailLabel}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={contactForm.emailPlaceholder}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{contactForm.messageLabel}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={contactForm.messagePlaceholder}
          rows={6}
          required
          disabled={isSubmitting}
          className="resize-none"
        />
      </div>

      <Button
        ref={buttonRef}
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
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
    </form>
  )
}

export default ContactForm
