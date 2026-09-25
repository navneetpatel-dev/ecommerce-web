import { LABELS } from "@/shared/constants/labels";
import { REFUND_STATUS } from "@/shared/constants/statuses";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ReturnRequest } from "@/shared/api/types";

export type ReturnRefundStatusKind =
  "completed" | "initiated" | "failed" | "pending";

export function getReturnRefundStatusKind(
  row: ReturnRequest,
): ReturnRefundStatusKind {
  if (row.refundStatus === REFUND_STATUS.COMPLETED) return "completed";
  if (row.refundStatus === REFUND_STATUS.INITIATED) return "initiated";
  if (row.refundStatus === REFUND_STATUS.FAILED) return "failed";
  return "pending";
}

export function returnInitiatedRefundDetail(row: ReturnRequest): string {
  const bankDetail =
    (row.razorpayRefundAmount ?? 0) > 0
      ? formatLabel(LABELS.returnRefundToBank, {
          amount: formatInr(row.razorpayRefundAmount),
        })
      : "";
  const walletDetail =
    (row.walletRefundAmount ?? 0) > 0
      ? formatLabel(LABELS.returnRefundToWallet, {
          amount: formatInr(row.walletRefundAmount),
        })
      : "";
  return `${LABELS.returnRefundStatusInitiated}${bankDetail}${walletDetail}`;
}

export function returnCreditNoteLine(row: ReturnRequest): string | null {
  if (!row.creditNoteNumber) return null;
  const against = row.againstInvoiceNumber
    ? ` · ${LABELS.againstInvoiceNumber}: ${row.againstInvoiceNumber}`
    : "";
  return `CN: ${row.creditNoteNumber}${against}`;
}
