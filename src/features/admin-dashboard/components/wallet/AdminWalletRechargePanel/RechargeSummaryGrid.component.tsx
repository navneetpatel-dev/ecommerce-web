import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import type { WalletRechargeReport } from "../../../api/finance/reports.api";
import { MetricCard } from "../../shared/MetricCard.component";
import { adminWalletRechargePanelStyles } from "./adminWalletRechargePanel.styles";

interface RechargeSummaryGridProps {
  report: WalletRechargeReport;
}

export function RechargeSummaryGrid({ report }: RechargeSummaryGridProps) {
  return (
    <div className={adminWalletRechargePanelStyles.summaryContainer}>
      <h3 className={adminWalletRechargePanelStyles.summaryTitle}>
        Recharge summary
      </h3>
      <div className={adminWalletRechargePanelStyles.summaryGrid}>
        <MetricCard
          label={LABELS.reportRechargeInrCollected}
          value={formatInr(report.totalInrCollected)}
          highlight
        />
        <MetricCard
          label={LABELS.reportPointsIssued}
          value={formatPoints(report.pointsIssued)}
        />
        <MetricCard
          label={LABELS.reportRechargeSuccessCount}
          value={String(report.successCount)}
        />
        <MetricCard
          label={LABELS.reportRechargeFailedCount}
          value={String(report.failedCount)}
        />
      </div>
    </div>
  );
}
