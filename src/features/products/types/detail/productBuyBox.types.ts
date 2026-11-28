import type { RefObject } from "react";
import type { ProductDetail, ProductVariant } from "@/shared/api/types";
import type { VariantSelectionProps } from "./types";

export interface ProductBuyBoxColumnProps {
  product: ProductDetail;
  addSectionRef: RefObject<HTMLDivElement | null>;
  resolvedVariant: ProductVariant | null;
  sellerScore: number | null;
  avgRating: number;
  reviewCount: number;
  onReviewsClick: () => void;
  hideRating?: boolean;
  /** A preview of a product that is not on sale: no offers, delivery check, notify-me, wishlist or share. */
  preview?: boolean;
  displayPrice: number;
  compareAtPrice: number | null;
  showMrp: boolean;
  discountPercent: number | null;
  gstPercentage: number;
  taxInclusiveEstimate: number | null;
  lowStockAt: number;
  displayStock: number;
  needsOptionSelection: boolean;
  variantUnavailable: boolean;
  canAddToCart: boolean;
  variantSelection: VariantSelectionProps;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  quantityMax: number;
  quantityDisabled: boolean;
  quantityDisabledHint: string;
  addDisabled: boolean;
  isSoldOut: boolean;
  addToCartHint: string;
  addToCartLabel: string;
  isAddingToCart?: boolean;
  onDeliveryBlockedChange: (blocked: boolean) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart?: (quantity: number) => void;
  freeShippingThreshold?: number;
  returnWindowDays?: number | null;
  returnsAllowed?: boolean;
  warrantyTypeLabel: string;
}
