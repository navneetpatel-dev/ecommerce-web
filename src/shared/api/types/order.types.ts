import type {
  OrderStatus,
  PaymentStatus,
  RefundStatus,
  ShipmentStatus,
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
  /** Card refund for this part when it was cancelled or came back undelivered (RTO). */
  cancelRefundAmount?: number | null;
  cancelRefundStatus?: RefundStatus | null;
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
  giftWrap?: boolean;
  giftMessage?: string | null;
  giftWrapFeeAmount?: number | null;
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
