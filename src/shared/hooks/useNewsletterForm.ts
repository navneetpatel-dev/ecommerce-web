'use client'

import { useState } from 'react'

const NEWSLETTER_KEY = 'newsletter-subscribed-email'

export function useNewsletterForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email address')
      setMessage(null)
      return
    }
    setPending(true)
    setError(null)
    setMessage(null)
    try {
      const { helpApi } = await import('@/features/help/api/help.api')
      await helpApi.createTicket({
        name: 'Newsletter subscriber',
        email: trimmed,
        topic: 'OTHER',
        subject: 'Newsletter subscription request',
        message: `Please add ${trimmed} to the deal-alert mailing list.`,
      })
      try {
        localStorage.setItem(NEWSLETTER_KEY, trimmed)
      } catch {
        // ignore storage failures
      }
      setMessage("Thanks — you're on the list. We'll be in touch.")
      setEmail('')
    } catch {
      setError('Could not subscribe right now. Try again or contact support.')
    } finally {
      setPending(false)
    }
  }

  return { email, setEmail, message, error, pending, handleSubmit }
}
