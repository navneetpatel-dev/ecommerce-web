"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminSectionTabs } from "../../components/shared/AdminSectionTabs.component";
import { useAdminFinancePage } from "../../hooks/finance/useAdminFinancePage";
import { AdminFinanceReportsTabs } from "../../components/finance/AdminFinanceReportsTabs.component";
import { AdminFinancePayoutsPanel } from "../../components/finance/AdminFinancePayoutsPanel.component";
import { LABELS } from "@/shared/constants/labels";

export function AdminFinancePage() {
  const page = useAdminFinancePage();

  const tabs = [
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
        <AdminFinancePayoutsPanel
          payouts={page.payouts}
          payoutRevision={page.payoutRevision}
          onProcessPayouts={page.processPayouts}
        />
      ),
    },
    {
      value: "reports",
      label: LABELS.reports,
      content: <AdminFinanceReportsTabs />,
    },
  ];

  return (
    <AdminSectionTabs
      title={LABELS.financePayouts}
      defaultValue="commissions"
      tabs={tabs}
    />
  );
}
