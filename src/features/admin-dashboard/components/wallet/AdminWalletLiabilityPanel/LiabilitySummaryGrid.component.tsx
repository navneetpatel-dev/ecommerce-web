import { LABELS } from "@/shared/constants/labels";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import type { WalletLiabilityReport } from "../../../api/finance/reports.api";
import { MetricCard } from "../../shared/MetricCard.component";
import { adminWalletLiabilityPanelStyles } from "../../../styles/wallet/adminWalletLiabilityPanel.styles";

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
          value={formatPoints(report.purchasedPointsLiability)}
        />
        <MetricCard
          label={LABELS.reportPromotionalPointsLiability}
          value={formatPoints(report.promotionalPointsLiability)}
        />
        <MetricCard
          label={LABELS.reportWalletCustomerCount}
          value={String(report.customerCount)}
        />
      </div>
    </div>
  );
}
