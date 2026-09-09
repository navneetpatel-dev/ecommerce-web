"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Receipt,
  Wallet,
  Coins,
  Percent,
  SlidersHorizontal,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { AdminDataPage } from "./AdminDataPage.page";
import { AdminSectionTabs } from "../components/AdminSectionTabs.component";
import { useAdminFinancePage } from "../hooks/useAdminFinancePage";
import { AdminSettlementReportsPanel } from "../components/AdminSettlementReportsPanel";
import { AdminWalletLiabilityPanel } from "../components/AdminWalletLiabilityPanel";
import { AdminWalletRechargePanel } from "../components/AdminWalletRechargePanel";
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
            <Tabs defaultValue="all" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-lg border border-line bg-paper/60 p-1">
                  <TabsTrigger
                    value="all"
                    className="gap-2 rounded-md border-b-0 px-3.5 py-2 text-body-sm text-ink-muted hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-elevation-1"
                  >
                    <LayoutGrid className="size-4" />
                    All reports
                  </TabsTrigger>
                  <TabsTrigger
                    value="settlement"
                    className="gap-2 rounded-md border-b-0 px-3.5 py-2 text-body-sm text-ink-muted hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-elevation-1"
                  >
                    <Receipt className="size-4" />
                    {LABELS.settlementReports}
                  </TabsTrigger>
                  <TabsTrigger
                    value="liability"
                    className="gap-2 rounded-md border-b-0 px-3.5 py-2 text-body-sm text-ink-muted hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-elevation-1"
                  >
                    <Wallet className="size-4" />
                    {LABELS.reportWalletLiability}
                  </TabsTrigger>
                  <TabsTrigger
                    value="recharge"
                    className="gap-2 rounded-md border-b-0 px-3.5 py-2 text-body-sm text-ink-muted hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-elevation-1"
                  >
                    <Coins className="size-4" />
                    {LABELS.reportWalletRecharge}
                  </TabsTrigger>
                  <TabsTrigger
                    value="cashback"
                    className="gap-2 rounded-md border-b-0 px-3.5 py-2 text-body-sm text-ink-muted hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-elevation-1"
                  >
                    <Percent className="size-4" />
                    {LABELS.reportCashbackWriteOff}
                  </TabsTrigger>
                  <TabsTrigger
                    value="adjust"
                    className="gap-2 rounded-md border-b-0 px-3.5 py-2 text-body-sm text-ink-muted hover:text-ink data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-elevation-1"
                  >
                    <SlidersHorizontal className="size-4" />
                    {LABELS.walletAdjustTitle}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0 space-y-6">
                <AdminSettlementReportsPanel />
                <AdminWalletLiabilityPanel />
                <AdminWalletRechargePanel />
                <AdminWalletAdjustPanel />
                <AdminCashbackWriteOffPanel />
              </TabsContent>

              <TabsContent value="settlement" className="mt-0">
                <AdminSettlementReportsPanel />
              </TabsContent>

              <TabsContent value="liability" className="mt-0">
                <AdminWalletLiabilityPanel />
              </TabsContent>

              <TabsContent value="recharge" className="mt-0">
                <AdminWalletRechargePanel />
              </TabsContent>

              <TabsContent value="cashback" className="mt-0">
                <AdminCashbackWriteOffPanel />
              </TabsContent>

              <TabsContent value="adjust" className="mt-0">
                <AdminWalletAdjustPanel />
              </TabsContent>
            </Tabs>
          ),
        },
      ]}
    />
  );
}
