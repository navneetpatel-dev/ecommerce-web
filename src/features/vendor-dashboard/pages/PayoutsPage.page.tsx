"use client";

import { usePayoutsPage } from "../hooks/usePayoutsPage.hook";
import { CommissionLedgerTable } from "../components/CommissionLedgerTable.component";
import { PayoutsTable } from "../components/PayoutsTable.component";
import { VendorSettlementReportPanel } from "../components/VendorSettlementReportPanel.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";

export function PayoutsPage() {
  const page = usePayoutsPage();

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
  );
}
