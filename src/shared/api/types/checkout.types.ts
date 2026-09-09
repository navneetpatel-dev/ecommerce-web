import type { ShippingMethod } from "@/shared/constants/statuses";
import type { VendorInfo } from "./vendor.types";
import type { OrderItem } from "./order.types";

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
  giftWrapFeeAmount?: number;
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
    giftWrapFeeAmount?: number;
  };
}
