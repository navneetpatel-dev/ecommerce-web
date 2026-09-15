import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { RefundBreakdownLine } from "../../utils/list/refundBreakdown";
import { returnRequestCardStyles as styles } from "../../styles/list/returnRequestCard.styles";

/** Renders one group of refund breakdown rows (composition or payment-method split). */
export function RefundBreakdownLines({
  lines,
}: {
  lines: RefundBreakdownLine[];
}) {
  return (
    <>
      {lines.map((line) => (
        <div key={line.label} className={styles.breakdownRow}>
          <dt>{line.label}</dt>
          <dd className={styles.breakdownValue}>
            {line.isDeduction ? "− " : ""}
            {formatInr(line.amount)}
          </dd>
        </div>
      ))}
    </>
  );
}
