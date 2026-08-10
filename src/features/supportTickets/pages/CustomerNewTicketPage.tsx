'use client'

import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { CreateTicketForm } from '../components/CreateTicketForm'
import { SupportAuthGate } from '../components/SupportAuthGate'

export function CustomerNewTicketPage() {
  return (
    <SupportAuthGate message={LABELS.ticketSignInRequired} loginNext={PATHS.supportTicketNew}>
      <div className="storefront-container py-8 md:py-10">
        <CreateTicketForm successHref={PATHS.supportTicket} />
      </div>
    </SupportAuthGate>
  )
}
