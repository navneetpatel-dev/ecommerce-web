import type {
  ReturnReason,
  ReturnStatus,
  RefundMethod,
  RefundStatus,
} from "@/shared/constants/statuses";

export interface ReturnRequest {
  id: string;
  subOrderId: string;
  orderItemId: string;
  userId: string;
  reason: string;
  reasonCode: ReturnReason;
  status: ReturnStatus;
  type?: "REFUND" | "EXCHANGE";
  rejectionReason?: string | null;
  replacementDeliveredAt?: string | null;
  photoUrls?: string[];
  refundMethod?: RefundMethod | null;
  refundStatus?: RefundStatus;
  refundCustomerMessage?: string | null;
  refundAmount: number | null;
  refundTaxAmount?: number | null;
  /** Pre-tax item part of the refund, as the backend pricing engine froze it at approval. */
  refundMerchandiseAmount?: number | null;
  shippingRefundAmount?: number;
  /** Deducted from the customer's refund for certain return reasons (e.g. "changed mind"); 0 when not applicable. */
  returnShippingFeeAmount?: number | null;
  walletRefundAmount?: number;
  razorpayRefundAmount?: number;
  receivedAt?: string | null;
  restockedAt?: string | null;
  resolvedAt: string | null;
  createdAt: string;
  productName: string | null;
  customerName?: string | null;
  creditNoteNumber?: string | null;
  creditNoteId?: string | null;
  debitNoteNumber?: string | null;
  debitNoteId?: string | null;
  againstInvoiceNumber?: string | null;
}
