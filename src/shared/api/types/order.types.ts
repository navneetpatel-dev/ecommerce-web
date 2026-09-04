import type {
  OrderStatus,
  PaymentStatus,
  ReturnReason,
  ReturnStatus,
  RefundMethod,
  RefundStatus,
  ReviewStatus,
  ShipmentStatus,
  ShippingMethod,
} from "@/shared/constants/statuses";
import type { Address } from "./common.types";
import type { VendorInfo } from "./vendor.types";

export interface OrderItem {
  id: string;
  variantId: string;
  productName: string;
  /** Looked up live from the catalogue, so it can be absent for removed products. */
  imageUrl?: string | null;
  productSlug?: string | null;
  /** Variant options as ordered, e.g. { Size: "XS", Color: "Black" }. */
  variantAttributes?: Record<string, string> | null;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
  lineTotal: number;
  discountAmount?: number;
  taxableAmount?: number;
  taxAmount?: number;
}

export interface Shipment {
  id: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string | null;
  status: ShipmentStatus;
  estimatedDeliveryDate: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  deliveryAgent?: { id: string; fullName: string; phone: string } | null;
  proofOfDeliveryUrl?: string | null;
  failureReason?: string | null;
  failedAttemptCount?: number;
  codAmount?: number | null;
  codCollected?: boolean;
  preferredRedeliverySlot?: string | null;
  attempts?: Array<{
    id: string;
    attemptNumber: number;
    note: string;
    photoUrl: string | null;
    attemptedAt: string;
  }>;
}

export interface SubOrder {
  id: string;
  orderId: string;
  vendorId: string;
  vendor: VendorInfo;
  status: OrderStatus;
  subtotal: number;
  shippingCost?: number;
  shippingCharged?: number;
  shippingDisplayKey?: "FREE" | "PAID";
  shippingDiscountAmount?: number;
  taxAmount?: number;
  taxDisplayKey?: "IGST" | "CGST_SGST" | "GST";
  taxableAmount?: number;
  discountAmount?: number;
  discountTotal?: number;
  customerTotal: number;
  taxInvoiceNumber?: string | null;
  taxInvoiceIssuedAt?: string | null;
  items: OrderItem[];
  shipment?: Shipment | null;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  discountTotal: number;
  merchandiseSubtotal?: number;
  taxTotal?: number;
  shippingTotal?: number;
  shippingDisplayKey?: "FREE" | "PAID";
  taxDisplayKey?: "IGST" | "CGST_SGST" | "GST";
  amountDue?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  walletAmountUsed?: number;
  razorpayAmountPaid?: number;
  cancelRefundStatus?: RefundStatus | null;
  cancelRazorpayRefundId?: string | null;
  originalTotalAmount?: number;
  pendingCashbackAmount?: number;
  cashbackCreditedAt?: string | null;
  createdAt: string;
  subOrders: SubOrder[];
  shippingAddress?: Address | null;
  openReturnCount?: number;
  returnRefundAlerts?: Array<{
    id: string;
    refundStatus: RefundStatus | string;
  }>;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderItemId: string;
  rating: number;
  title: string | null;
  body: string;
  status: ReviewStatus;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  user?: { name: string };
  product?: { id: string; name: string; slug: string };
}

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
  preferredRepickupSlot?: string | null;
  replacementDeliveredAt?: string | null;
  replacementProofUrl?: string | null;
  photoUrls?: string[];
  refundMethod?: RefundMethod | null;
  refundStatus?: RefundStatus;
  refundCustomerMessage?: string | null;
  refundAmount: number | null;
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

export interface ShippingRate {
  method: ShippingMethod;
  cost: number;
  shippingDisplayKey: "FREE" | "PAID";
  estimatedDays: number;
}

export interface VendorBreakdown {
  vendorId: string;
  vendor: VendorInfo;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  shippingDisplayKey: "FREE" | "PAID";
  tax: { cgst: number; sgst: number; igst: number; total: number };
  taxDisplayKey: "IGST" | "CGST_SGST" | "GST";
  discount: number;
  total: number;
}

export interface CheckoutQuote {
  vendorBreakdowns: VendorBreakdown[];
  grandTotal: number;
  cashbackAmount: number;
  walletBalance: number;
  walletAmountToUse: number;
  amountDue: number;
  maxWalletApplicable?: number;
  appliedCoupon: {
    code: string;
    discount: number;
    cashbackAmount?: number;
    type?: string;
  } | null;
  appliedCoupons?: Array<{
    code: string;
    discount: number;
    cashbackAmount?: number;
    type?: string;
  }>;
  /** Cart grand total meets COD min/max — PDP uses `codEligibleAtUnitPrice` for unit price. */
  codAvailable?: boolean;
  orderTotals: {
    merchandiseSubtotal: number;
    shippingTotal: number;
    shippingDisplayKey: "FREE" | "PAID";
    taxTotal: number;
    cgst: number;
    sgst: number;
    igst: number;
    discountTotal: number;
    taxDisplayKey: "IGST" | "CGST_SGST" | "GST";
  };
}
