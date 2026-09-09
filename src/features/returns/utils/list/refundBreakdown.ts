import { returnRefundBreakdownLabels } from "@/shared/constants/labels/returnRefundBreakdown";
import type { ReturnRequest } from "@/shared/api/types";

export interface RefundBreakdownLine {
  label: string;
  amount: number;
}

export function buildRefundBreakdownLines(
  row: ReturnRequest,
): RefundBreakdownLine[] {
  const candidates: Array<{
    label: string;
    amount: number | null | undefined;
  }> = [
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
  ];

  return candidates.filter(
    (line): line is RefundBreakdownLine =>
      line.amount != null && line.amount > 0,
  );
}
