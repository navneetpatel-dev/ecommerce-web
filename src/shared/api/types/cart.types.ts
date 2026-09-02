import type { UnavailableReason } from "@/shared/constants/statuses";
import type { ProductListItem } from "./product.types";
import type { VendorInfo } from "./vendor.types";

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  /**
   * Server-decided cap for this line (stock vs the cart policy cap). The API
   * silently clamps to it, so never offer more than this in a stepper.
   */
  maxQuantity?: number;
  lineSubtotal?: number;
  isAvailable: boolean;
  unavailableReason: UnavailableReason | null;
  product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: number;
    vendor: VendorInfo;
  };
  variant: {
    sku: string;
    attributes: Record<string, string>;
    weightGrams?: number;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  total?: number;
  merchandiseSubtotal?: number;
  pricingPreview?: {
    merchandiseSubtotal: number;
    discount: number;
    taxTotal: number;
    shippingTotal: number;
    shippingDisplayKey: "FREE" | "PAID";
    grandTotal: number;
    /**
     * What the server based tax and shipping on. The cart has no chosen address or
     * shipping method, so anything but EXACT is an estimate — checkout re-quotes.
     *
     * NO_SHIPPING_RATE means no rate matched the default address, so shipping shows
     * as zero here but checkout will reject that address.
     */
    basisKey: "EXACT" | "DEFAULT_ADDRESS" | "NO_SHIPPING_RATE" | "NO_ADDRESS";
  };
  appliedCoupon?: AppliedCouponSummary | null;
  appliedCoupons?: AppliedCouponSummary[];
  removedCouponReason?: string | null;
  /** Diagnostic/read-only weights; shipping APIs recompute them server-side. */
  vendorShippingWeights?: Record<string, number>;
}

export interface AppliedCouponSummary {
  code: string;
  discount: number;
  cashbackAmount?: number;
  type?: string;
  vendorDiscountShares?: Record<string, number>;
  /** Authoritative pay-now total after apply (from cart pricing preview). */
  payNowGrandTotal?: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  priceAtAdd: number;
  isAvailable: boolean;
  unavailableReason: UnavailableReason | null;
  product: ProductListItem;
}
