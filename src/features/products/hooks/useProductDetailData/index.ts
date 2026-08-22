"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useProduct } from "../../api/products.queries";
import { useVariantSelection } from "../useVariantSelection";
import { useCategories } from "@/features/categories";
import { usePublicSettings } from "@/shared/hooks/usePublicSettings";
import { cartLineQuantityMax } from "@/shared/constants/cart";

export function useProductDetailData() {
  const params = useParams<{ slug: string }>();
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProduct(params?.slug || "");
  const { data: categories = [] } = useCategories({
    enabled: Boolean(product),
  });
  const { data: settings } = usePublicSettings();

  const variants = useMemo(() => product?.variants ?? [], [product?.variants]);
  const variantStockTotal = variants.reduce(
    (sum, variant) => sum + Number(variant.stock || 0),
    0,
  );
  const baseStock = Number(product?.stock ?? 0) || variantStockTotal;
  const basePrice = Number(product?.basePrice ?? 0);

  const selection = useVariantSelection(variants, basePrice, baseStock);

  const resolvedVariantId =
    selection.variantId ??
    (variants.length === 1 ? variants[0]?.id : null) ??
    null;

  const selectedStock = selection.variantId
    ? Number(selection.currentStock || 0)
    : variants.length === 1
      ? Number(variants[0]?.stock || 0)
      : 0;

  const hasAttributeOptions = Object.keys(selection.attributeGroups).length > 0;
  const needsOptionSelection =
    hasAttributeOptions && !selection.hasCompleteSelection;
  const variantUnavailable =
    hasAttributeOptions &&
    selection.hasCompleteSelection &&
    !selection.matchedVariant;

  const maxQuantity = cartLineQuantityMax(selectedStock);

  const canAddToCart =
    Boolean(product) &&
    Boolean(resolvedVariantId) &&
    selectedStock > 0 &&
    !needsOptionSelection &&
    !variantUnavailable;

  return {
    product,
    isLoading,
    isError,
    onRetry: () => void refetch(),
    categories,
    settings,
    basePrice,
    selection,
    resolvedVariantId,
    maxQuantity,
    needsOptionSelection,
    variantUnavailable,
    canAddToCart,
  };
}
