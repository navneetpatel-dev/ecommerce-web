"use client";

import { useState, useCallback, useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { cartLineQuantityMax } from "@/shared/constants/cart/cart";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { resolveVariantPricing } from "../../utils/detail/variantPricing";
import {
  getAddToCartHint,
  getAddToCartLabel,
  getQuantityDisabledHint,
  getStickyAddLabel,
} from "../../constants/detail/labels";
import type { ProductDetailContentProps } from "../../types/detail/types";

interface UseProductDetailContentParams {
  product: ProductDetailContentProps["product"];
  variantSelection: ProductDetailContentProps["variantSelection"];
  maxQuantity?: number;
  canAddToCart?: boolean;
  needsOptionSelection?: boolean;
  variantUnavailable?: boolean;
  isAddingToCart?: boolean;
  showStickyBar?: boolean;
}

export function useProductDetailContent({
  product,
  variantSelection,
  maxQuantity,
  canAddToCart = true,
  needsOptionSelection = false,
  variantUnavailable = false,
  isAddingToCart = false,
  showStickyBar = false,
}: UseProductDetailContentParams) {
  const [deliveryBlocked, setDeliveryBlocked] = useState(false);
  const [detailTab, setDetailTab] = useState("description");

  const {
    resolvedVariant,
    displayPrice,
    displayStock,
    taxInclusiveEstimate,
    showMrp,
    discountPercent,
    lowStockAt,
  } = useMemo(
    () => resolveVariantPricing(product, variantSelection),
    [product, variantSelection],
  );

  const quantityMax = maxQuantity ?? cartLineQuantityMax(displayStock);
  const purchaseBlocked = Boolean(!canAddToCart || deliveryBlocked);
  const addDisabled = Boolean(purchaseBlocked || isAddingToCart);
  const quantityDisabled = purchaseBlocked;

  const quantityDisabledHint = getQuantityDisabledHint({
    needsOptionSelection,
    variantUnavailable,
    canAddToCart,
  });

  const reviewCount = product.reviewCount ?? 0;
  const avgRating = product.avgRating ?? 0;
  const formattedPrice = formatInr(displayPrice);
  const compareAtPrice = product.compareAtPrice ?? null;

  const warrantyTypeLabel =
    product.displayWarrantyType === WARRANTY_TYPE.SELLER
      ? LABELS.warrantySeller
      : LABELS.warrantyManufacturer;

  const sellerScore =
    product.vendorPerformanceScore ?? product.vendor?.performanceScore ?? null;

  const categoryName = product.category?.name ?? product.categoryName ?? null;

  const addToCartLabel = getAddToCartLabel({
    needsOptionSelection,
    variantUnavailable,
    displayStock,
  });

  const stickyAddLabel = getStickyAddLabel(
    needsOptionSelection,
    variantUnavailable,
    formattedPrice,
  );

  const addToCartHint = getAddToCartHint({
    needsOptionSelection,
    variantUnavailable,
    displayStock,
    deliveryBlocked,
    isAddingToCart,
  });

  const isStickyBarVisible =
    showStickyBar &&
    (displayStock > 0 || needsOptionSelection || variantUnavailable);

  const handleReviewsClick = useCallback(() => {
    setDetailTab("reviews");
  }, []);

  return {
    deliveryBlocked,
    setDeliveryBlocked,
    detailTab,
    setDetailTab,
    displayStock,
    quantityMax,
    addDisabled,
    quantityDisabled,
    quantityDisabledHint,
    reviewCount,
    avgRating,
    displayPrice,
    formattedPrice,
    compareAtPrice,
    showMrp,
    discountPercent,
    taxInclusiveEstimate,
    resolvedVariant,
    lowStockAt,
    warrantyTypeLabel,
    sellerScore,
    categoryName,
    addToCartLabel,
    stickyAddLabel,
    addToCartHint,
    isStickyBarVisible,
    handleReviewsClick,
  };
}
