"use client";

import { useEffect } from "react";
import { trackRecentlyViewed } from "../utils/recently-viewed";
import { useWishlistToggle } from "./useWishlistToggle";
import { useProductDetailData } from "./useProductDetailData/index";
import { useProductDetailGallery } from "./useProductDetailGallery/index";
import { useProductDetailActions } from "./useProductDetailActions/index";
import { useProductDetailBreadcrumbs } from "./useProductDetailBreadcrumbs/index";

export function useProductDetail() {
  const {
    product,
    isLoading,
    categories,
    settings,
    basePrice,
    selection,
    resolvedVariantId,
    maxQuantity,
    needsOptionSelection,
    variantUnavailable,
    canAddToCart,
  } = useProductDetailData();
  const { isWishlisted, toggle } = useWishlistToggle(product?.id);
  const gallery = useProductDetailGallery(resolvedVariantId, maxQuantity);
  const { isAddingToCart, handleAddToCart } = useProductDetailActions({
    resolvedVariantId,
    needsOptionSelection,
    variantUnavailable,
    maxQuantity,
  });

  useEffect(() => {
    if (!product) return;
    trackRecentlyViewed(product);
  }, [product]);

  const breadcrumbItems = useProductDetailBreadcrumbs(product, categories);

  return {
    product,
    isLoading,
    freeShippingThreshold:
      product?.vendorFreeShippingThreshold ?? settings?.freeShippingThreshold,
    returnWindowDays:
      product?.returnWindowDays ?? settings?.defaultReturnWindow,
    returnsAllowed: product?.returnsAllowed,
    isWishlisted: isWishlisted || false,
    toggleWishlist: toggle,
    selectedImage: gallery.selectedImage,
    setSelectedImage: gallery.setSelectedImage,
    quantity: gallery.quantity,
    setQuantity: gallery.handleQuantityChange,
    maxQuantity,
    showStickyBar: gallery.showStickyBar,
    addSectionRef: gallery.addSectionRef,
    breadcrumbItems,
    isAddingToCart,
    canAddToCart,
    needsOptionSelection,
    variantUnavailable,
    onAddToCart: handleAddToCart,
    variantSelection: {
      attributeGroups: selection.attributeGroups,
      currentPrice: Number(selection.currentPrice || basePrice),
      currentStock: Number(selection.currentStock || 0),
      basePrice,
      hasPriceChange: selection.hasPriceChange,
      matchedVariant: selection.matchedVariant,
      isAvailable: selection.isAvailable,
      isActive: selection.isActive,
      onSelectValue: selection.selectValue,
    },
  };
}
