import { LABELS } from "@/shared/constants/labels";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import { formatInrExact } from "@/shared/utils/formatting/orderFormat";

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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function formatReportCell(
  value: unknown,
  format?: string,
  columnKey?: string,
): string {
  if (value == null) return LABELS.emptyCell;
  if (typeof value === "string" && UUID_REGEX.test(value)) {
    return "—";
  }
  if (columnKey === "reconStatus" && typeof value === "string") {
    return PG_RECON_STATUS_LABELS[value] ?? value;
  }
  if (format === "currency") {
    const n = Number(value);
    return Number.isFinite(n) ? formatInrExact(n) : String(value);
  }
  if (format === "points") {
    const n = Number(value);
    return Number.isFinite(n)
      ? `${n.toLocaleString("en-IN")} pts`
      : String(value);
  }
  if (format === "date") {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime())
      ? String(value)
      : formatDateTime(value as string | Date);
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      if (value.length === 0) return LABELS.emptyCell;
      if (value.every((v) => typeof v === "string" || typeof v === "number")) {
        return value.join(", ");
      }
      return `${value.length} items`;
    }
    const obj = value as Record<string, unknown>;
    const name = obj.name ?? obj.title ?? obj.businessName ?? obj.label;
    if (typeof name === "string" && name.trim()) return name.trim();
    return LABELS.emptyCell;
  }
  return String(value);
}
