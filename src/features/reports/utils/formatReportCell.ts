import { LABELS } from "@/shared/constants/labels";

const PG_RECON_STATUS_LABELS: Record<string, string> = {
  MATCHED: LABELS.reconStatusMatched,
  WALLET_SETTLED: LABELS.reconStatusWalletSettled,
  MISSING_PG_REF: LABELS.reconStatusMissingPgRef,
  PENDING: LABELS.reconStatusPending,
  FAILED: LABELS.reconStatusFailed,
  REFUNDED: LABELS.reconStatusRefunded,
  NOT_APPLICABLE: LABELS.reconStatusNotApplicable,
  REVIEW: LABELS.reconStatusReview,
};

export function formatReportCell(
  value: unknown,
  format?: string,
  columnKey?: string,
): string {
  if (value == null) return LABELS.emptyCell;
  if (columnKey === "reconStatus" && typeof value === "string") {
    return PG_RECON_STATUS_LABELS[value] ?? value;
  }
  if (format === "currency") {
    const n = Number(value);
    return Number.isFinite(n) ? `₹${n.toFixed(2)}` : String(value);
  }
  if (format === "points") {
    const n = Number(value);
    return Number.isFinite(n) ? `${n.toLocaleString()} pts` : String(value);
  }
  if (format === "date") {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
