import { Scale } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";
import { cn } from "@/shared/utils/cn";
import { ReportExportButtons, type ExportFileFormat } from "@/features/reports";
import type { ReconciliationReport } from "../../api/reports.api";
import { MetricCard } from "../MetricCard.component";

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
  return (
    <div className="rounded-lg border border-line bg-paper/40 p-4 md:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Scale className="size-4 text-brand" />
          <h3 className="font-display text-body font-semibold text-ink">
            {LABELS.reconciliation}
          </h3>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-body-xs font-medium",
              recon.balanced
                ? "bg-success/10 text-success border border-success/20"
                : "bg-danger/10 text-danger border border-danger/20",
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
        <p className="text-body-sm font-medium text-danger">
          {LABELS.reconciliationDifference}: {formatInr(recon.difference)}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recon.walletRechargeInflow != null ? (
          <MetricCard
            label={LABELS.walletRechargeInflow}
            value={formatInr(recon.walletRechargeInflow)}
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
