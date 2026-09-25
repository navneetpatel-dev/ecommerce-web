import { returnRefundBreakdownLabels } from "@/shared/constants/labels/returnRefundBreakdown";
import type { ReturnRequest } from "@/shared/api/types";

export interface RefundBreakdownLine {
  label: string;
  amount: number;
  /** True for a deduction (rendered as "− ₹X") rather than a credit. */
  isDeduction?: boolean;
}

export interface RefundBreakdownGroups {
  /** What the refund is made of (merchandise + tax + shipping) — sums to the total refund. */
  compositionLines: RefundBreakdownLine[];
  /** How the same total was paid out (wallet vs bank/UPI) — an orthogonal split of that total,
   * not additional money on top of it. Rendered as a separate group so the two views never read
   * as one flat, additive list that sums to more than the actual refund. */
  methodLines: RefundBreakdownLine[];
}

function positiveLines(
  candidates: Array<{ label: string; amount: number | null | undefined }>,
): RefundBreakdownLine[] {
  return candidates.filter(
    (line): line is RefundBreakdownLine =>
      line.amount != null && line.amount > 0,
  );
}

export function buildRefundBreakdownLines(
  row: ReturnRequest,
): RefundBreakdownGroups {
  // Every figure is the backend pricing engine's own; nothing is derived here.
  const merchandise = Number(row.refundMerchandiseAmount ?? 0);
  const tax = Number(row.refundTaxAmount ?? 0);
  const shipping = Number(row.shippingRefundAmount ?? 0);
  const fee = Number(row.returnShippingFeeAmount ?? 0);

  const compositionLines = positiveLines([
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownItem,
      amount: merchandise,
    },
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownTax,
      amount: tax,
    },
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownShipping,
      amount: shipping,
    },
  ]);
  if (fee > 0) {
    compositionLines.push({
      label: returnRefundBreakdownLabels.returnRefundBreakdownFee,
      amount: fee,
      isDeduction: true,
    });
  }

  const methodLines = positiveLines([
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownWallet,
      amount: row.walletRefundAmount,
    },
    {
      label: returnRefundBreakdownLabels.returnRefundBreakdownBank,
      amount: row.razorpayRefundAmount,
    },
  ]);

  return { compositionLines, methodLines };
}
