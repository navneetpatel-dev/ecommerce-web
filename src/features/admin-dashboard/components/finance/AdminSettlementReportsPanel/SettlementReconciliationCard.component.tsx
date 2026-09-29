import { Scale } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import { cn } from "@/shared/utils/dom/cn";
import { ReportExportButtons, type ExportFileFormat } from "@/features/reports";
import type { ReconciliationReport } from "../../../api/finance/reports.api";
import { MetricCard } from "../../shared/MetricCard.component";
import { SettlementReconciliationLines } from "./SettlementReconciliationLines.component";
import { useSettlementReconciliationLines } from "../../../hooks/finance/useSettlementReconciliationLines.hook";
import { adminSettlementReportsPanelStyles } from "../../../styles/finance/adminSettlementReportsPanel.styles";

interface SettlementReconciliationCardProps {
  recon: ReconciliationReport;
  controlsDisabled: boolean;
  exportingFormat?: ExportFileFormat | null;
  message: string | null;
  onExport: (format: ExportFileFormat) => void;
}

export function SettlementReconciliationCard({
  recon,
  controlsDisabled,
  exportingFormat,
  message,
  onExport,
}: SettlementReconciliationCardProps) {
  const lines = useSettlementReconciliationLines(recon);
  return (
    <div className={adminSettlementReportsPanelStyles.reconCard}>
      <div className={adminSettlementReportsPanelStyles.reconHeader}>
        <div className={adminSettlementReportsPanelStyles.reconHeaderLeft}>
          <Scale className={adminSettlementReportsPanelStyles.reconIcon} />
          <h3 className={adminSettlementReportsPanelStyles.reconTitle}>
            {LABELS.reconciliation}
          </h3>
          <span
            className={cn(
              adminSettlementReportsPanelStyles.reconBadgeBase,
              recon.balanced
                ? adminSettlementReportsPanelStyles.reconBadgeBalanced
                : adminSettlementReportsPanelStyles.reconBadgeMismatch,
            )}
          >
            {recon.balanced
              ? LABELS.reconciliationBalanced
              : LABELS.reconciliationMismatch}
          </span>
        </div>
        <ReportExportButtons
          size="sm"
          controlsDisabled={controlsDisabled}
          exportingFormat={exportingFormat}
          statusMessage={message}
          onExportExcel={() => onExport("xlsx")}
          onExportCsv={() => onExport("csv")}
          onExportPdf={() => onExport("pdf")}
        />
      </div>
      {!recon.balanced ? (
        <p className={adminSettlementReportsPanelStyles.reconDiffText}>
          {LABELS.reconciliationDifference}: {formatInr(recon.difference)}
        </p>
      ) : null}
      <SettlementReconciliationLines lines={lines} />
      <div className={adminSettlementReportsPanelStyles.reconGrid}>
        {recon.walletRechargeInflow != null ? (
          <MetricCard
            label={LABELS.walletRechargeInflow}
            value={formatInr(recon.walletRechargeInflow)}
          />
        ) : null}
        {recon.giftCardRedemptionInflow != null ? (
          <MetricCard
            label={LABELS.giftCardRedemptionInflow}
            value={formatInr(recon.giftCardRedemptionInflow)}
          />
        ) : null}
        {recon.walletPointsRedeemedAtCheckout != null ? (
          <MetricCard
            label={LABELS.walletPointsRedeemedAtCheckout}
            value={formatPoints(recon.walletPointsRedeemedAtCheckout)}
          />
        ) : null}
      </div>
    </div>
  );
}
