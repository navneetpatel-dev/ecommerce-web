"use client";

import { useMemo } from "react";
import { useVariantSelection } from "../variants/useVariantSelection.hook";
import { cartLineQuantityMax } from "@/shared/constants/cart/cart";
import {
  customerPrice,
  withCustomerPrices,
} from "@/shared/utils/pricing/customerPrice";
import type { ProductDetail } from "@/shared/api/types";

/**
 * Everything the product page derives from a loaded product: customer prices (GST included), the
 * chosen variant, what can be added to the cart. Shared by the storefront page and the
 * "view as customer" preview, so both always agree.
 */
export function useProductDetailSelection(
  product: ProductDetail | null | undefined,
  options: { initialVariantId?: string | null } = {},
) {
  // Prices on the page are what the customer pays, GST included.
  const variants = useMemo(
    () => withCustomerPrices(product?.variants ?? []),
    [product?.variants],
  );
  const variantStockTotal = variants.reduce(
    (sum, variant) => sum + Number(variant.stock || 0),
    0,
  );
  const baseStock = Number(product?.stock ?? 0) || variantStockTotal;
  const basePrice = Number(product ? customerPrice(product) : 0);

  const selection = useVariantSelection(variants, basePrice, baseStock, {
    initialVariantId: options.initialVariantId,
  });

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
  // Only a combination that no variant has. A sold-out variant is a real choice:
  // it shows "Out of stock" and Notify me instead.
  const variantUnavailable =
    hasAttributeOptions &&
    selection.hasCompleteSelection &&
    !selection.selectedVariant;

  const maxQuantity = cartLineQuantityMax(selectedStock);

  const canAddToCart =
    Boolean(product) &&
    Boolean(resolvedVariantId) &&
    selectedStock > 0 &&
    !needsOptionSelection &&
    !variantUnavailable;

  return {
    variants,
    basePrice,
    selection,
    resolvedVariantId,
    maxQuantity,
    needsOptionSelection,
    variantUnavailable,
    canAddToCart,
  };
}
