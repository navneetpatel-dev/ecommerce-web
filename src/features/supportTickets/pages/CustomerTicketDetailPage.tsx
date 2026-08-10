'use client'

import { useParams } from 'next/navigation'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { useSupportTicket } from '../api/supportTickets.queries'
import { SupportAuthGate } from '../components/SupportAuthGate'
import { TicketThread } from '../components/TicketThread'

export function CustomerTicketDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  return (
    <SupportAuthGate
      message={LABELS.ticketSignInRequired}
      loginNext={PATHS.supportTicket(id)}
    >
      <CustomerTicketDetailContent id={id} />
    </SupportAuthGate>
  )
}

function CustomerTicketDetailContent({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useSupportTicket(id)

  if (isLoading) {
    return (
      <div className="storefront-container space-y-3 py-6 md:py-8">
        <Skeleton className="h-14 w-full max-w-xl" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="storefront-container py-8">
        <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
          {(error as Error | null)?.message || LABELS.ticketCouldNotLoadDetail}
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_10%,transparent),transparent_60%)]"
      />
      <div className="storefront-container relative py-6 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:py-8 lg:pb-10">
        <TicketThread ticket={data} mode="customer" />
      </div>
    </div>
  )
}
