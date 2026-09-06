import type {
  CommissionStatus,
  PayoutStatus,
} from "@/shared/constants/statuses";

export interface WalletTransaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  balanceAfter: number;
  referenceType: string | null;
  referenceId: string | null;
  rechargeId?: string | null;
  description: string | null;
  pointSource?: string | null;
  createdAt: string;
}

export interface CommissionLedgerEntry {
  id: string;
  vendorId: string;
  subOrderId: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  createdAt: string;
  /** From TdsLedger (joined by subOrderId) — null when no TDS entry exists yet. */
  tdsAmount: number | null;
  tdsRatePercent: number | null;
  tdsSection: string | null;
  /** GST breakdown aggregated from OrderItem rows for this sub-order — null when unavailable. */
  gstTaxableAmount: number | null;
  gstAmount: number | null;
  gstCgst: number | null;
  gstSgst: number | null;
  gstIgst: number | null;
}

export type PayoutPaymentMethod =
  "NEFT" | "IMPS" | "UPI" | "RTGS" | "CHEQUE" | "CASH" | "OTHER";

export interface PayoutEntry {
  id: string;
  vendorId: string;
  vendorName?: string | null;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: PayoutStatus;
  paidAt: string | null;
  paymentMethod: PayoutPaymentMethod | null;
  paymentReferenceNumber: string | null;
  proofOfPaymentUrl: string | null;
  remarks: string | null;
  failureReason: string | null;
  preparedAt: string | null;
}
