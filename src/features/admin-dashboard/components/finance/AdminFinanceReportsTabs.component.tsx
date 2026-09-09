"use client";

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
import { AdminSettlementReportsPanel } from "./AdminSettlementReportsPanel/index";
import { AdminWalletLiabilityPanel } from "../wallet/AdminWalletLiabilityPanel/index";
import { AdminWalletRechargePanel } from "../wallet/AdminWalletRechargePanel/index";
import { AdminWalletAdjustPanel } from "../wallet/AdminWalletAdjustPanel.component";
import { AdminCashbackWriteOffPanel } from "../wallet/AdminCashbackWriteOffPanel.component";
import { LABELS } from "@/shared/constants/labels";
import { adminFinancePageStyles } from "../../pages/finance/adminFinancePage.styles";

export function AdminFinanceReportsTabs() {
  return (
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
  );
}
