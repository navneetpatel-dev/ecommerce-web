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

/** A refund not started yet: its amount when known ("Refund of ₹767.00 pending"). */
export function returnPendingRefundDetail(row: ReturnRequest): string {
  return row.refundAmount != null
    ? formatLabel(LABELS.returnRefundPendingAmount, {
        amount: formatInr(row.refundAmount),
      })
    : LABELS.returnRefundStatusPending;
}

/**
 * Why the refund is smaller than the item's price, shown in every refund state: the offer
 * the kept items no longer qualify for, and cashback taken back from the wallet.
 */
export function returnRefundNotes(row: ReturnRequest): string[] {
  const notes: string[] = [];
  if ((row.offerAdjustment ?? 0) > 0) {
    notes.push(
      formatLabel(LABELS.returnOfferAdjustment, {
        amount: formatInr(row.offerAdjustment),
      }),
    );
  }
  if ((row.cashbackClawback ?? 0) > 0) {
    notes.push(
      formatLabel(LABELS.returnCashbackClawback, {
        amount: formatInr(row.cashbackClawback),
      }),
    );
  }
  return notes;
}

export function returnCreditNoteLine(row: ReturnRequest): string | null {
  if (!row.creditNoteNumber) return null;
  const against = row.againstInvoiceNumber
    ? ` · ${LABELS.againstInvoiceNumber}: ${row.againstInvoiceNumber}`
    : "";
  return `CN: ${row.creditNoteNumber}${against}`;
}
