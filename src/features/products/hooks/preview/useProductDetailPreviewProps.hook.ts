"use client";

import type { ProductDetail } from "@/shared/api/types";
import { useProductDetailGallery } from "../gallery/useProductDetailGallery/index";
import { useProductDetailSelection } from "../detail/useProductDetailSelection.hook";
import { getProductBreadcrumbItems } from "../detail/useProductDetailBreadcrumbs/index";

/**
 * Props for the customer's product page, derived from a product exactly as the storefront does
 * (customer prices with GST, variant choices, gallery), with buying switched off and no ratings,
 * reviews, questions or related products.
 */
export function useProductDetailPreviewProps(
  product: ProductDetail | null | undefined,
) {
  const selection = useProductDetailSelection(product);
  const gallery = useProductDetailGallery(
    selection.resolvedVariantId,
    selection.maxQuantity,
  );
  if (!product) return null;
  return {
    product,
    preview: true,
    isWishlisted: false,
    onToggleWishlist: () => undefined,
    canAddToCart: false,
    isAddingToCart: false,
    needsOptionSelection: selection.needsOptionSelection,
    variantUnavailable: selection.variantUnavailable,
    selectedImage: gallery.selectedImage,
    onSelectImage: gallery.setSelectedImage,
    quantity: gallery.quantity,
    onQuantityChange: gallery.handleQuantityChange,
    maxQuantity: selection.maxQuantity,
    showStickyBar: false,
    addSectionRef: gallery.addSectionRef,
    breadcrumbItems: getProductBreadcrumbItems(product, []),
    freeShippingThreshold: product.vendorFreeShippingThreshold ?? undefined,
    returnWindowDays: product.returnWindowDays,
    returnsAllowed: product.returnsAllowed,
    variantSelection: {
      attributeGroups: selection.selection.attributeGroups,
      currentPrice: Number(
        selection.selection.currentPrice || selection.basePrice,
      ),
      currentStock: Number(selection.selection.currentStock || 0),
      matchedVariant: selection.selection.matchedVariant,
      selectedVariant: selection.selection.selectedVariant,
      isAvailable: selection.selection.isAvailable,
      changesOtherChoices: selection.selection.changesOtherChoices,
      isActive: selection.selection.isActive,
      onSelectValue: selection.selection.selectValue,
    },
  };
}
