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
import { adminFinancePageStyles } from "./adminFinancePage.styles";

export function AdminFinancePage() {
  const page = useAdminFinancePage();
  const [payoutRevision, setPayoutRevision] = useState(0);

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
        <div className={adminFinancePageStyles.payoutsStack}>
          <div className={adminFinancePageStyles.payoutsActionRow}>
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
        <Tabs defaultValue="all" className={adminFinancePageStyles.reportsTabs}>
          <div className={adminFinancePageStyles.reportsHeaderRow}>
            <TabsList className={adminFinancePageStyles.reportsTabsList}>
              <TabsTrigger
                value="all"
                className={adminFinancePageStyles.reportsTabTrigger}
              >
                <LayoutGrid className={adminFinancePageStyles.tabIcon} />
                All reports
              </TabsTrigger>
              <TabsTrigger
                value="settlement"
                className={adminFinancePageStyles.reportsTabTrigger}
              >
                <Receipt className={adminFinancePageStyles.tabIcon} />
                {LABELS.settlementReports}
              </TabsTrigger>
              <TabsTrigger
                value="liability"
                className={adminFinancePageStyles.reportsTabTrigger}
              >
                <Wallet className={adminFinancePageStyles.tabIcon} />
                {LABELS.reportWalletLiability}
              </TabsTrigger>
              <TabsTrigger
                value="recharge"
                className={adminFinancePageStyles.reportsTabTrigger}
              >
                <Coins className={adminFinancePageStyles.tabIcon} />
                {LABELS.reportWalletRecharge}
              </TabsTrigger>
              <TabsTrigger
                value="cashback"
                className={adminFinancePageStyles.reportsTabTrigger}
              >
                <Percent className={adminFinancePageStyles.tabIcon} />
                {LABELS.reportCashbackWriteOff}
              </TabsTrigger>
              <TabsTrigger
                value="adjust"
                className={adminFinancePageStyles.reportsTabTrigger}
              >
                <SlidersHorizontal className={adminFinancePageStyles.tabIcon} />
                {LABELS.walletAdjustTitle}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="all"
            className={adminFinancePageStyles.reportsAllContent}
          >
            <AdminSettlementReportsPanel />
            <AdminWalletLiabilityPanel />
            <AdminWalletRechargePanel />
            <AdminWalletAdjustPanel />
            <AdminCashbackWriteOffPanel />
          </TabsContent>

          <TabsContent
            value="settlement"
            className={adminFinancePageStyles.reportsSingleContent}
          >
            <AdminSettlementReportsPanel />
          </TabsContent>
          <TabsContent
            value="liability"
            className={adminFinancePageStyles.reportsSingleContent}
          >
            <AdminWalletLiabilityPanel />
          </TabsContent>
          <TabsContent
            value="recharge"
            className={adminFinancePageStyles.reportsSingleContent}
          >
            <AdminWalletRechargePanel />
          </TabsContent>
          <TabsContent
            value="cashback"
            className={adminFinancePageStyles.reportsSingleContent}
          >
            <AdminCashbackWriteOffPanel />
          </TabsContent>
          <TabsContent
            value="adjust"
            className={adminFinancePageStyles.reportsSingleContent}
          >
            <AdminWalletAdjustPanel />
          </TabsContent>
        </Tabs>
      ),
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
