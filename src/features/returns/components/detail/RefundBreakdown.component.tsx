import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { ReturnRequest } from "@/shared/api/types";
import { returnRequestCardStyles as styles } from "../../styles/list/returnRequestCard.styles";
import { buildRefundBreakdownLines } from "../../utils/list/refundBreakdown";

/**
 * Line-item refund detail for the customer-facing return card. Every amount
 * here is already computed server-side (returns.service.ts serializeReturn)
 * — this only decides which non-zero lines to render, never adds or
 * subtracts them.
 */
export function RefundBreakdown({ row }: { row: ReturnRequest }) {
  const lines = buildRefundBreakdownLines(row);

  if (lines.length === 0) return null;

  return (
    <dl className={styles.breakdownList}>
      {lines.map((line) => (
        <div key={line.label} className={styles.breakdownRow}>
          <dt>{line.label}</dt>
          <dd className={styles.breakdownValue}>{formatInr(line.amount)}</dd>
        </div>
      ))}
    </dl>
  );
}
