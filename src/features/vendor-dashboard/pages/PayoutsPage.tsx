'use client'
import { useVendorCommissions, useVendorPayouts } from '../api/vendor.queries'
import { CommissionLedgerTable } from '../components/CommissionLedgerTable'
import { PayoutsTable } from '../components/PayoutsTable'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function PayoutsPage() {
  const { data: commissions, isLoading: loadingComm } = useVendorCommissions()
  const { data: payouts, isLoading: loadingPay } = useVendorPayouts()

  return (
    <div className="space-y-8">
      {loadingComm ? <Skeleton className="h-40 w-full" /> : <CommissionLedgerTable commissions={commissions} />}
      {loadingPay ? <Skeleton className="h-40 w-full" /> : <PayoutsTable payouts={payouts} />}
    </div>
  )
}
