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
  deliveryAgentId?: string | null;
  pickupOtpVerifiedAt?: string | null;
  pickupFailureReason?: string | null;
  rejectionReason?: string | null;
  preferredRepickupSlot?: string | null;
  replacementDeliveredAt?: string | null;
  replacementProofUrl?: string | null;
  photoUrls?: string[];
  refundMethod?: RefundMethod | null;
  refundStatus?: RefundStatus;
  refundCustomerMessage?: string | null;
  refundAmount: number | null;
  refundTaxAmount?: number | null;
  shippingRefundAmount?: number;
  walletRefundAmount?: number;
  razorpayRefundAmount?: number;
  receivedAt?: string | null;
  resolvedAt: string | null;
  createdAt: string;
  productName: string | null;
  creditNoteNumber?: string | null;
  creditNoteId?: string | null;
  debitNoteNumber?: string | null;
  debitNoteId?: string | null;
  againstInvoiceNumber?: string | null;
}
