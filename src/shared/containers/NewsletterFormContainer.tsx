'use client'

import { useNewsletterForm } from '@/shared/hooks/useNewsletterForm'
import { NewsletterForm } from '@/shared/components/NewsletterForm'

interface NewsletterFormContainerProps {
  idPrefix: string
}

export function NewsletterFormContainer({ idPrefix }: NewsletterFormContainerProps) {
  const { email, setEmail, message, error, pending, handleSubmit } = useNewsletterForm()

  return (
    <NewsletterForm
      idPrefix={idPrefix}
      email={email}
      message={message}
      error={error}
      pending={pending}
      onEmailChange={setEmail}
      onSubmit={handleSubmit}
    />
  )
}
