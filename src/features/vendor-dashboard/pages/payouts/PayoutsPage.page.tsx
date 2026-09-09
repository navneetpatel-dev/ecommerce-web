"use client";

import { usePayoutsPage } from "../../hooks/payouts/usePayoutsPage.hook";
import { CommissionLedgerTable } from "../../components/commission/CommissionLedgerTable.component";
import { CommissionInvoicesTable } from "../../components/commission/CommissionInvoicesTable.component";
import { PayoutsTable } from "../../components/payouts/PayoutsTable.component";
import { VendorSettlementReportPanel } from "../../components/payouts/VendorSettlementReportPanel.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { vendorPagesStyles } from "../overview/vendorPages.styles";

export function PayoutsPage() {
  const page = usePayoutsPage();

  return (
    <RequirePermission permission={PERMISSIONS.PAYOUT_VIEW}>
      <div className={vendorPagesStyles.stackLg}>
        <VendorSettlementReportPanel />
        {page.loadingComm ? (
          <Skeleton className={vendorPagesStyles.skeletonCard} />
        ) : (
          <CommissionLedgerTable commissions={page.commissions} />
        )}
        {page.loadingInv ? (
          <Skeleton className={vendorPagesStyles.skeletonCard} />
        ) : (
          <CommissionInvoicesTable invoices={page.invoices} />
        )}
        {page.loadingPay ? (
          <Skeleton className={vendorPagesStyles.skeletonCard} />
        ) : (
          <PayoutsTable payouts={page.payouts} />
        )}
      </div>
    </RequirePermission>
  );
}
