"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { productsApi } from "../../api/listing/products.api";
import { trackRecentlyViewed } from "../../utils/related/recently-viewed";
import { useWishlistToggle } from "../card/useWishlistToggle.hook";
import { useProductDetailData } from "./useProductDetailData/index";
import { useProductDetailGallery } from "../gallery/useProductDetailGallery/index";
import { useProductDetailActions } from "./useProductDetailActions/index";
import { useProductDetailBreadcrumbs } from "./useProductDetailBreadcrumbs/index";

export function useProductDetail() {
  const {
    product,
    isLoading,
    isError,
    onRetry: retryProduct,
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
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const gallery = useProductDetailGallery(resolvedVariantId, maxQuantity);
  const { isAddingToCart, handleAddToCart } = useProductDetailActions({
    resolvedVariantId,
    needsOptionSelection,
    variantUnavailable,
    maxQuantity,
  });

  useEffect(() => {
    if (!product) return;
    // Guest history stays localStorage-only; logged-in shoppers additionally
    // sync server-side so it follows them across devices/browsers.
    trackRecentlyViewed(product);
    if (isAuthenticated) {
      void productsApi.trackRecentlyViewed(product.id).catch(() => {});
    }
  }, [product, isAuthenticated]);

  const breadcrumbItems = useProductDetailBreadcrumbs(product, categories);

  return {
    product,
    isLoading,
    isError,
    retryProduct,
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
