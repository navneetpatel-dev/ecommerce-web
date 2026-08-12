'use client'

import Link from 'next/link'
import { LifeBuoy } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import { FormError } from '@/shared/components/FormError'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { InfiniteLoadMore } from '@/shared/components/InfiniteLoadMore'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { LABELS } from '@/shared/constants/labels'
import { formatOrderDate } from '@/features/orders/utils/format'
import type { SupportTicket } from '../api/supportTickets.api'
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
} from '../utils/labels'

type Props = {
  tickets: SupportTicket[]
  detailHref: (id: string) => string
  createHref: string
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
}

export function TicketCardList({
  tickets,
  detailHref,
  createHref,
  isLoading,
  isError,
  errorMessage,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <FormError
        error={new Error(errorMessage || LABELS.ticketCouldNotLoad)}
        fallback={LABELS.ticketCouldNotLoad}
      />
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="border border-dashed border-line bg-paper/50">
        <EmptyState
          icon={LifeBuoy}
          heading={LABELS.supportTicketsEmpty}
          message={LABELS.supportTicketsEmptyMessage}
          actionLabel={LABELS.createSupportTicket}
          actionTo={createHref}
          className="py-14"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="min-w-0">
            <Link
              href={detailHref(ticket.id)}
              className="group flex h-full flex-col border border-line bg-surface-raised px-4 py-4 transition-colors hover:border-brand/40 hover:bg-brand-subtle/30 sm:px-5"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {ticket.hasUnread ? (
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-brand"
                      title={LABELS.ticketHasUnread}
                      aria-label={LABELS.ticketHasUnread}
                    />
                  ) : null}
                  <span className="font-mono text-[0.75rem] tabular-nums text-ink-muted">
                    {ticket.ticketNumber}
                  </span>
                  <StatusBadge
                    status={ticket.status}
                    label={TICKET_STATUS_LABEL[ticket.status]}
                  />
                  <StatusBadge
                    status={ticket.priority}
                    label={TICKET_PRIORITY_LABEL[ticket.priority]}
                  />
                </div>
                <p className="line-clamp-2 font-medium text-ink group-hover:text-brand">
                  {ticket.subject}
                </p>
                {ticket.latestMessagePreview ? (
                  <p className="line-clamp-2 text-[0.875rem] text-ink-muted">
                    {ticket.latestMessagePreview}
                  </p>
                ) : null}
                <p className="text-[0.8125rem] text-ink-faint">
                  {TICKET_CATEGORY_LABEL[ticket.category]} · {formatOrderDate(ticket.createdAt)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <InfiniteLoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />
    </div>
  )
}
