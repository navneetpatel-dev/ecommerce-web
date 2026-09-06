import { returnRefundBreakdownLabels } from "@/shared/constants/labels/returnRefundBreakdown";
import { formatInr } from "@/shared/utils/orderFormat";
import type { ReturnRequest } from "@/shared/api/types";

interface RefundLine {
  label: string;
  amount: number | null | undefined;
}

/**
 * Line-item refund detail for the customer-facing return card. Every amount
 * here is already computed server-side (returns.service.ts serializeReturn)
 * — this only decides which non-zero lines to render, never adds or
 * subtracts them.
 */
export function RefundBreakdown({ row }: { row: ReturnRequest }) {
  const lines: RefundLine[] = [
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownItem,
      amount: row.refundAmount,
    },
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownTax,
      amount: row.refundTaxAmount,
    },
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownShipping,
      amount: row.shippingRefundAmount,
    },
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownWallet,
      amount: row.walletRefundAmount,
    },
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownBank,
      amount: row.razorpayRefundAmount,
    },
  ].filter((line) => line.amount != null && line.amount > 0);

  if (lines.length === 0) return null;

  return (
    <dl className="mt-2 space-y-0.5 border-t border-line pt-2 text-body-sm text-ink-muted">
      {lines.map((line) => (
        <div key={line.label} className="flex justify-between gap-4">
          <dt>{line.label}</dt>
          <dd className="tabular-nums text-ink">
            {formatInr(line.amount as number)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
