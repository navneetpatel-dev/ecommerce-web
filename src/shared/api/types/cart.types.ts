import type { UnavailableReason } from "@/shared/constants/statuses";
import type { ProductListItem } from "./product.types";
import type { VendorInfo } from "./vendor.types";

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
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
    grandTotal: number;
  };
  appliedCoupon?: AppliedCouponSummary | null;
  appliedCoupons?: AppliedCouponSummary[];
  removedCouponReason?: string | null;
}

export interface AppliedCouponSummary {
  code: string;
  discount: number;
  cashbackAmount?: number;
  type?: string;
  vendorDiscountShares?: Record<string, number>;
}

export interface WishlistItem {
  id: string;
  productId: string;
  priceAtAdd: number;
  isAvailable: boolean;
  unavailableReason: UnavailableReason | null;
  product: ProductListItem;
}
