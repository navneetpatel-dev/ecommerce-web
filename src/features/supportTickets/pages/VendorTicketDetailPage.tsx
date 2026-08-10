'use client'

import { useParams } from 'next/navigation'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { useSupportTicket } from '../api/supportTickets.queries'
import { TicketThread } from '../components/TicketThread'

export function VendorTicketDetailPage() {
  return (
    <RequirePermission permission={PERMISSIONS.SUBORDER_MANAGE}>
      <VendorTicketDetailContent />
    </RequirePermission>
  )
}

function VendorTicketDetailContent() {
  const params = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useSupportTicket(params.id)

  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (isError || !data) {
    return (
      <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
        {(error as Error | null)?.message || LABELS.ticketCouldNotLoadDetail}
      </p>
    )
  }

  return <TicketThread ticket={data} mode="vendor" />
}
