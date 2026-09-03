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
