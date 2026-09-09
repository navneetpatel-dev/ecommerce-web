"use client";

import { useState, useCallback, useMemo } from "react";
import type { ProductListItem } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { MAX_COMPARED_PRODUCTS } from "../../constants/compare/compare";
import { resolveProductStock } from "../../utils/card/productListItem";

interface UseProductCardParams {
  product: ProductListItem;
  showQuickAdd?: boolean;
  cartQuantity?: number;
  compareAtLimit?: boolean;
  isCompared?: boolean;
  onToggleCompare?: (product: ProductListItem) => void;
}

export function useProductCard({
  product,
  showQuickAdd = true,
  cartQuantity = 0,
  compareAtLimit = false,
  isCompared = false,
  onToggleCompare,
}: UseProductCardParams) {
  const [imageUnavailable, setImageUnavailable] = useState(!product.imageUrl);

  const handleUnavailableChange = useCallback((unavailable: boolean) => {
    setImageUnavailable(unavailable);
  }, []);

  const inCart = cartQuantity > 0;
  const canQuickAdd =
    showQuickAdd &&
    Boolean(product.variants?.[0]?.id) &&
    resolveProductStock(product) > 0;

  const handleCompareCheckedChange = useCallback(() => {
    if (compareAtLimit && !isCompared) return;
    onToggleCompare?.(product);
  }, [compareAtLimit, isCompared, onToggleCompare, product]);

  const compareMaxHint = useMemo(() => {
    return formatLabel(LABELS.compareMaxReached, {
      max: String(MAX_COMPARED_PRODUCTS),
    });
  }, []);

  return {
    imageUnavailable,
    handleUnavailableChange,
    inCart,
    canQuickAdd,
    handleCompareCheckedChange,
    compareMaxHint,
  };
}
