"use client";

import { AdminDataPage } from "./AdminDataPage.page";
import { AdminSectionTabs } from "../components/AdminSectionTabs.component";
import { useAdminFinancePage } from "../hooks/useAdminFinancePage";
import { AdminSettlementReportsPanel } from "../components/AdminSettlementReportsPanel.component";
import { AdminWalletLiabilityPanel } from "../components/AdminWalletLiabilityPanel.component";
import { AdminCashbackWriteOffPanel } from "../components/AdminCashbackWriteOffPanel.component";
import { LABELS } from "@/shared/constants/labels";

export function AdminFinancePage() {
  const page = useAdminFinancePage();

  return (
    <AdminSectionTabs
      title={LABELS.financePayouts}
      defaultValue="commissions"
      tabs={[
        {
          value: "commissions",
          label: LABELS.commissions,
          content: (
            <AdminDataPage
              title={page.commissions.title}
              permission={page.commissions.permission}
              load={page.commissions.load}
              columnKeys={page.commissions.columnKeys}
              hideTitle
            />
          ),
        },
        {
          value: "payouts",
          label: LABELS.payouts,
          content: (
            <AdminDataPage
              title={page.payouts.title}
              permission={page.payouts.permission}
              load={page.payouts.load}
              actions={page.payouts.actions}
              columnKeys={page.payouts.columnKeys}
              hideTitle
            />
          ),
        },
        {
          value: "reports",
          label: LABELS.reports,
          content: (
            <div className="space-y-10">
              <AdminSettlementReportsPanel />
              <AdminWalletLiabilityPanel />
              <AdminCashbackWriteOffPanel />
            </div>
          ),
        },
      ]}
    />
  );
}
