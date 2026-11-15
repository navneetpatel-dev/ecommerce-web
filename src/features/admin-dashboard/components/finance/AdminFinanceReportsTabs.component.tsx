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
import { AdminFinanceReportsOverview } from "./AdminFinanceReportsOverview.component";
import { LABELS } from "@/shared/constants/labels";
import { useUrlTabState } from "@/shared/hooks/navigation/useUrlTabState.hook";
import { adminFinancePageStyles } from "../../pages/finance/adminFinancePage.styles";

export const REPORT_TABS = [
  "all",
  "settlement",
  "liability",
  "recharge",
  "cashback",
  "adjust",
] as const;

export type FinanceReportTab = (typeof REPORT_TABS)[number];

export function AdminFinanceReportsTabs() {
  // Own URL key: this sits inside the page's section tabs (`?tab=`).
  const [report, setReport] = useUrlTabState(REPORT_TABS, "all", "report");

  return (
    <Tabs
      value={report}
      onValueChange={setReport}
      className={adminFinancePageStyles.reportsTabs}
    >
      <div className={adminFinancePageStyles.reportsHeaderRow}>
        <TabsList className={adminFinancePageStyles.reportsTabsList}>
          <TabsTrigger
            value="all"
            className={adminFinancePageStyles.reportsTabTrigger}
          >
            <LayoutGrid className={adminFinancePageStyles.tabIcon} />
            {LABELS.allReports}
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
        <AdminFinanceReportsOverview onSelectTab={setReport} />
      </TabsContent>

      <TabsContent
        value="settlement"
        className={adminFinancePageStyles.reportsSingleContent}
      >
        {report === "settlement" && <AdminSettlementReportsPanel />}
      </TabsContent>
      <TabsContent
        value="liability"
        className={adminFinancePageStyles.reportsSingleContent}
      >
        {report === "liability" && <AdminWalletLiabilityPanel />}
      </TabsContent>
      <TabsContent
        value="recharge"
        className={adminFinancePageStyles.reportsSingleContent}
      >
        {report === "recharge" && <AdminWalletRechargePanel />}
      </TabsContent>
      <TabsContent
        value="cashback"
        className={adminFinancePageStyles.reportsSingleContent}
      >
        {report === "cashback" && <AdminCashbackWriteOffPanel />}
      </TabsContent>
      <TabsContent
        value="adjust"
        className={adminFinancePageStyles.reportsSingleContent}
      >
        {report === "adjust" && <AdminWalletAdjustPanel />}
      </TabsContent>
    </Tabs>
  );
}
