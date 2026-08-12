'use client'

import { useState } from 'react'
import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import { LABELS } from '@/shared/constants/labels'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'

const NEWSLETTER_KEY = 'newsletter-subscribed-email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useNewsletterForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setError(LABELS.newsletterInvalidEmail)
      setMessage(null)
      return
    }
    setPending(true)
    setError(null)
    setMessage(null)
    try {
      const result = await apiClient.post<{
        subscribed: boolean
        alreadySubscribed: boolean
      }>(API.newsletter.subscribe, { email: trimmed })
      try {
        localStorage.setItem(NEWSLETTER_KEY, trimmed)
      } catch {
        // ignore storage failures
      }
      setMessage(
        result.alreadySubscribed
          ? LABELS.newsletterAlreadySubscribed
          : LABELS.newsletterSuccess,
      )
      setEmail('')
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.newsletterCouldNotSubscribe))
    } finally {
      setPending(false)
    }
  }

  return { email, setEmail, message, error, pending, handleSubmit }
}
