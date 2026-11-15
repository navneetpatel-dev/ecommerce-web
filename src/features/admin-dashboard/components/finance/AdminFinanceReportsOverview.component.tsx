"use client";

import { memo } from "react";
import {
  Receipt,
  Wallet,
  Coins,
  Percent,
  SlidersHorizontal,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { adminFinancePageStyles as styles } from "../../pages/finance/adminFinancePage.styles";
import type { FinanceReportTab } from "./AdminFinanceReportsTabs.component";

interface ReportHubItem {
  id: Exclude<FinanceReportTab, "all">;
  title: string;
  description: string;
  icon: LucideIcon;
}

const REPORT_HUB_ITEMS: readonly ReportHubItem[] = [
  {
    id: "settlement",
    title: LABELS.settlementReports,
    description: LABELS.reportSettlementDesc,
    icon: Receipt,
  },
  {
    id: "liability",
    title: LABELS.reportWalletLiability,
    description: LABELS.reportLiabilityDesc,
    icon: Wallet,
  },
  {
    id: "recharge",
    title: LABELS.reportWalletRecharge,
    description: LABELS.reportRechargeDesc,
    icon: Coins,
  },
  {
    id: "cashback",
    title: LABELS.reportCashbackWriteOff,
    description: LABELS.reportCashbackDesc,
    icon: Percent,
  },
  {
    id: "adjust",
    title: LABELS.walletAdjustTitle,
    description: LABELS.reportAdjustDesc,
    icon: SlidersHorizontal,
  },
];

interface OverviewCardProps {
  item: ReportHubItem;
  onSelect: (tab: FinanceReportTab) => void;
}

const OverviewCard = memo(function OverviewCard({
  item,
  onSelect,
}: OverviewCardProps) {
  const handleClick = () => {
    onSelect(item.id);
  };

  const Icon = item.icon;

  return (
    <div className={styles.overviewCard}>
      <div className={styles.overviewCardHeader}>
        <div className={styles.overviewCardIconWrapper}>
          <Icon className={styles.tabIcon} aria-hidden />
        </div>
        <h3 className={styles.overviewCardTitle}>{item.title}</h3>
        <p className={styles.overviewCardDescription}>{item.description}</p>
      </div>
      <div className={styles.overviewCardFooter}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-body-sm font-medium text-brand hover:text-brand"
          onClick={handleClick}
        >
          <span>{LABELS.viewReport}</span>
          <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      </div>
    </div>
  );
});

interface AdminFinanceReportsOverviewProps {
  onSelectTab: (tab: FinanceReportTab) => void;
}

export function AdminFinanceReportsOverview({
  onSelectTab,
}: AdminFinanceReportsOverviewProps) {
  return (
    <div className={styles.overviewGrid}>
      {REPORT_HUB_ITEMS.map((item) => (
        <OverviewCard key={item.id} item={item} onSelect={onSelectTab} />
      ))}
    </div>
  );
}
