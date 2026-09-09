"use client";

import { useState, useCallback, useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { cartLineQuantityMax } from "@/shared/constants/cart/cart";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
import { VARIANT_LOW_STOCK_DEFAULT } from "../../constants/listing-form/productFields";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
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

  const displayPrice = Number(
    variantSelection.currentPrice || product.basePrice || 0,
  );
  const displayStock = Number(
    variantSelection.currentStock || product.stock || 0,
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
  const formattedPrice = formatInrAmount(displayPrice);
  const compareAtPrice = product.compareAtPrice ?? null;
  const showMrp = product.showMrp ?? false;
  const discountPercent = product.discountPercent ?? null;
  const taxInclusiveEstimate = product.taxInclusivePrice ?? null;

  const resolvedVariant = useMemo(() => {
    return (
      variantSelection.matchedVariant ??
      (product.variants?.length === 1 ? product.variants[0] : null)
    );
  }, [variantSelection.matchedVariant, product.variants]);

  const lowStockAt = Number(
    resolvedVariant?.lowStockAt ?? VARIANT_LOW_STOCK_DEFAULT,
  );

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
