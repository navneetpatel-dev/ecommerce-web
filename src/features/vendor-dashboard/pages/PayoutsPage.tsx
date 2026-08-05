'use client'

import { usePayoutsPage } from '../hooks/usePayoutsPage'
import { CommissionLedgerTable } from '../components/CommissionLedgerTable'
import { PayoutsTable } from '../components/PayoutsTable'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function PayoutsPage() {
  const page = usePayoutsPage()

  return (
    <div className="space-y-8">
      {page.loadingComm ? <Skeleton className="h-40 w-full" /> : <CommissionLedgerTable commissions={page.commissions} />}
      {page.loadingPay ? <Skeleton className="h-40 w-full" /> : <PayoutsTable payouts={page.payouts} />}
    </div>
  )
}
