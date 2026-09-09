import { LABELS } from "@/shared/constants/labels";
import { formatPoints } from "@/shared/utils/formatPoints";
import type { WalletLiabilityReport } from "../../api/reports.api";
import { MetricCard } from "../MetricCard.component";
import { adminWalletLiabilityPanelStyles } from "./adminWalletLiabilityPanel.styles";

interface LiabilitySummaryGridProps {
  report: WalletLiabilityReport;
}

export function LiabilitySummaryGrid({ report }: LiabilitySummaryGridProps) {
  return (
    <div className={adminWalletLiabilityPanelStyles.summaryContainer}>
      <h3 className={adminWalletLiabilityPanelStyles.summaryTitle}>
        Liability summary
      </h3>
      <div className={adminWalletLiabilityPanelStyles.summaryGrid}>
        <MetricCard
          label={LABELS.reportTotalLiability}
          value={formatPoints(
            report.totalPointsLiability ?? report.totalLiability,
          )}
          highlight
        />
        <MetricCard
          label={LABELS.reportPurchasedPointsLiability}
          value={formatPoints(report.purchasedPointsLiability ?? 0)}
        />
        <MetricCard
          label={LABELS.reportPromotionalPointsLiability}
          value={formatPoints(report.promotionalPointsLiability ?? 0)}
        />
        <MetricCard
          label={LABELS.reportWalletCustomerCount}
          value={String(report.customerCount)}
        />
      </div>
    </div>
  );
}
