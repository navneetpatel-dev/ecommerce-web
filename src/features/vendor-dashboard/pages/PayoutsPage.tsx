'use client'

import { usePayoutsPage } from '../hooks/usePayoutsPage'
import { CommissionLedgerTable } from '../components/CommissionLedgerTable'
import { PayoutsTable } from '../components/PayoutsTable'
import { VendorSettlementReportPanel } from '../components/VendorSettlementReportPanel'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { PERMISSIONS } from '@/shared/constants/permissions'

export function PayoutsPage() {
  const page = usePayoutsPage()

  return (
    <RequirePermission permission={PERMISSIONS.PAYOUT_VIEW}>
      <div className="space-y-8">
        <VendorSettlementReportPanel />
        {page.loadingComm ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <CommissionLedgerTable commissions={page.commissions} />
        )}
        {page.loadingPay ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <PayoutsTable payouts={page.payouts} />
        )}
      </div>
    </RequirePermission>
  )
}
