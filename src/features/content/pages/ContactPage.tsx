'use client'

import { useContactPage } from '../hooks/useContactPage'
import { ContactView } from '../components/ContactView'

export function ContactPage() {
  const { supportEmail, supportHours, isLoading } = useContactPage()
  return <ContactView supportEmail={supportEmail} supportHours={supportHours} isLoading={isLoading} />
}
