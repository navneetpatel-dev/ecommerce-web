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
  quantity: number;
  unitPrice: number;
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
}

export interface SubOrder {
  id: string;
  orderId: string;
  vendorId: string;
  vendor: VendorInfo;
  status: OrderStatus;
  subtotal: number;
  shippingCost?: number;
  taxAmount?: number;
  items: OrderItem[];
  shipment?: Shipment | null;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  discountTotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  walletAmountUsed?: number;
  razorpayAmountPaid?: number;
  originalTotalAmount?: number;
  pendingCashbackAmount?: number;
  cashbackCreditedAt?: string | null;
  createdAt: string;
  subOrders: SubOrder[];
  shippingAddress?: Address | null;
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
  photoUrls?: string[];
  refundMethod?: RefundMethod | null;
  refundStatus?: RefundStatus;
  refundAmount: number | null;
  walletRefundAmount?: number;
  razorpayRefundAmount?: number;
  receivedAt?: string | null;
  resolvedAt: string | null;
  createdAt: string;
  productName: string | null;
}

export interface ShippingRate {
  method: ShippingMethod;
  cost: number;
  estimatedDays: number;
}

export interface VendorBreakdown {
  vendorId: string;
  vendor: VendorInfo;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: { cgst: number; sgst: number; igst: number; total: number };
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
  codAvailable?: boolean;
}
