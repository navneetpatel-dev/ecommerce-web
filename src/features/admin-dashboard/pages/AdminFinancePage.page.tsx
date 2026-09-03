"use client";

import { useState } from "react";
import { AdminDataPage } from "./AdminDataPage.page";
import { AdminSectionTabs } from "../components/AdminSectionTabs.component";
import { useAdminFinancePage } from "../hooks/useAdminFinancePage";
import { AdminSettlementReportsPanel } from "../components/AdminSettlementReportsPanel.component";
import { AdminWalletLiabilityPanel } from "../components/AdminWalletLiabilityPanel.component";
import { AdminWalletRechargePanel } from "../components/AdminWalletRechargePanel.component";
import { AdminWalletAdjustPanel } from "../components/AdminWalletAdjustPanel.component";
import { AdminCashbackWriteOffPanel } from "../components/AdminCashbackWriteOffPanel.component";
import { LABELS } from "@/shared/constants/labels";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { payoutsApi } from "../api/finance.api";

export function AdminFinancePage() {
  const page = useAdminFinancePage();
  const [payoutRevision, setPayoutRevision] = useState(0);

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
          value: "commission-invoices",
          label: LABELS.commissionInvoices,
          content: (
            <AdminDataPage
              title={page.commissionInvoices.title}
              permission={page.commissionInvoices.permission}
              load={page.commissionInvoices.load}
              actions={page.commissionInvoices.actions}
              columnKeys={page.commissionInvoices.columnKeys}
              hideTitle
            />
          ),
        },
        {
          value: "payouts",
          label: LABELS.payouts,
          content: (
            <div className="space-y-4">
              <div className="flex justify-end">
                <AdminConfirmAction
                  label={LABELS.processPayouts}
                  dialogVariant="warning"
                  tone="success"
                  title={LABELS.confirmProcessPayoutsTitle}
                  description={LABELS.confirmProcessPayoutsBody}
                  onConfirm={() =>
                    payoutsApi
                      .process()
                      .then(() => setPayoutRevision((value) => value + 1))
                  }
                />
              </div>
              <AdminDataPage
                key={payoutRevision}
                title={page.payouts.title}
                permission={page.payouts.permission}
                load={page.payouts.load}
                actions={page.payouts.actions}
                columnKeys={page.payouts.columnKeys}
                hideTitle
              />
            </div>
          ),
        },
        {
          value: "reports",
          label: LABELS.reports,
          content: (
            <div className="space-y-10">
              <AdminSettlementReportsPanel />
              <AdminWalletLiabilityPanel />
              <AdminWalletRechargePanel />
              <AdminWalletAdjustPanel />
              <AdminCashbackWriteOffPanel />
            </div>
          ),
        },
      ]}
    />
  );
}
