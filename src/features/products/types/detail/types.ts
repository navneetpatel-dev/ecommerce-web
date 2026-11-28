import type { RefObject } from "react";
import type { ProductDetail, ProductVariant } from "@/shared/api/types";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface VariantSelectionProps {
  attributeGroups: Record<string, string[]>;
  currentPrice: number;
  currentStock: number;
  matchedVariant?: ProductVariant | null;
  /** The variant the selection points at, sold out or not. */
  selectedVariant?: ProductVariant | null;
  isAvailable: (key: string, value: string) => boolean;
  changesOtherChoices?: (key: string, value: string) => string[];
  isActive: (key: string, value: string) => boolean;
  onSelectValue: (key: string, value: string) => void;
}

export interface ProductDetailContentProps {
  product: ProductDetail;
  /**
   * Showing the page as a preview (while creating or reviewing a product): no ratings, reviews,
   * questions, related products or sticky buy bar, since none of that exists for the product yet.
   */
  preview?: boolean;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart?: (quantity: number) => void;
  isAddingToCart?: boolean;
  canAddToCart?: boolean;
  needsOptionSelection?: boolean;
  variantUnavailable?: boolean;
  selectedImage: number;
  onSelectImage: (index: number) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  showStickyBar: boolean;
  addSectionRef: RefObject<HTMLDivElement | null>;
  breadcrumbItems: BreadcrumbItem[];
  variantSelection: VariantSelectionProps;
  freeShippingThreshold?: number;
  returnWindowDays?: number | null;
  returnsAllowed?: boolean;
}
