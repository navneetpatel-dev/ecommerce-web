import { returnRefundBreakdownLabels } from "@/shared/constants/labels/returnRefundBreakdown";
import type { ReturnRequest } from "@/shared/api/types";
import { returnRequestCardStyles as styles } from "../../styles/list/returnRequestCard.styles";
import { buildRefundBreakdownLines } from "../../utils/list/refundBreakdown";
import { RefundBreakdownLines } from "./RefundBreakdownLines.component";

/**
 * Line-item refund detail for the customer-facing return card. Every amount here is already
 * computed server-side (returns.service.ts serializeReturn) — this only decides which non-zero
 * lines to render, never adds or subtracts them, except deriving one display-only "merchandise"
 * figure (see buildRefundBreakdownLines) that undoes a fee deduction already netted into the
 * total, so the whole composition group genuinely adds back up to the refund total.
 *
 * Rendered as two separate groups on purpose: composition (which sums to the refund total) and
 * payment method (wallet vs bank/UPI, an orthogonal split of that SAME total) — flattening both
 * into one list would read as amounts that sum to roughly double the actual refund.
 */
export function RefundBreakdown({ row }: { row: ReturnRequest }) {
  const { compositionLines, methodLines } = buildRefundBreakdownLines(row);

  if (compositionLines.length === 0 && methodLines.length === 0) return null;

  return (
    <>
      {compositionLines.length > 0 && (
        <dl className={styles.breakdownList}>
          <RefundBreakdownLines lines={compositionLines} />
        </dl>
      )}
      {methodLines.length > 0 && (
        <dl className={styles.breakdownMethodGroup}>
          <div className={styles.breakdownGroupCaption}>
            {returnRefundBreakdownLabels.returnRefundBreakdownMethodCaption}
          </div>
          <RefundBreakdownLines lines={methodLines} />
        </dl>
      )}
    </>
  );
}
