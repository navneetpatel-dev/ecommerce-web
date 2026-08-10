'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { useMyTicketsInfinite } from '../api/supportTickets.queries'
import { SupportAuthGate } from '../components/SupportAuthGate'
import { TicketCardList } from '../components/TicketCardList'

export function CustomerTicketsPage() {
  return (
    <SupportAuthGate message={LABELS.ticketSignInRequired} loginNext={PATHS.supportTickets}>
      <CustomerTicketsContent />
    </SupportAuthGate>
  )
}

function CustomerTicketsContent() {
  const query = useMyTicketsInfinite()
  const tickets = query.data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div className="storefront-container py-8 md:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-2xl space-y-1">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.mySupportTickets}
          </h1>
          <p className="text-[0.9375rem] text-ink-muted">{LABELS.supportTicketsPageDescription}</p>
        </div>
        <Button asChild className="shrink-0">
          <Link href={PATHS.supportTicketNew}>{LABELS.createSupportTicket}</Link>
        </Button>
      </header>

      <TicketCardList
        tickets={tickets}
        detailHref={PATHS.supportTicket}
        createHref={PATHS.supportTicketNew}
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={(query.error as Error | null)?.message}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        onLoadMore={() => void query.fetchNextPage()}
      />
    </div>
  )
}
