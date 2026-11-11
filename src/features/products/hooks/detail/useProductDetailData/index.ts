"use client";

import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useProduct } from "../../../api/listing/products.queries";
import { useVariantSelection } from "../../variants/useVariantSelection.hook";
import { useCategories } from "@/features/categories";
import { usePublicSettings } from "@/shared/hooks/usePublicSettings.hook";
import { cartLineQuantityMax } from "@/shared/constants/cart/cart";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";
import {
  customerPrice,
  withCustomerPrices,
} from "@/shared/utils/pricing/customerPrice";

/** Query key that keeps the chosen variant in the product URL. */
export const VARIANT_QUERY_PARAM = "variant";

export function useProductDetailData() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params?.slug ?? "";
  const urlVariantId = searchParams?.get(VARIANT_QUERY_PARAM) ?? null;
  const productQuery = useProduct(slug);
  const {
    data: product,
    isLoading,
    isEmpty: isProductEmpty,
    isError,
  } = resolveQueryDetailState(productQuery, { enabled: Boolean(slug) });
  const refetch = productQuery.refetch;
  const { data: categories = [] } = useCategories({
    enabled: Boolean(product),
  });
  const { data: settings } = usePublicSettings();

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
    initialVariantId: urlVariantId,
  });

  // Keep the chosen variant in the URL so reload and shared links keep it.
  const chosenVariantId = selection.selectedVariant?.id ?? null;
  useEffect(() => {
    if (!chosenVariantId || variants.length < 2) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get(VARIANT_QUERY_PARAM) === chosenVariantId) return;
    url.searchParams.set(VARIANT_QUERY_PARAM, chosenVariantId);
    window.history.replaceState(window.history.state, "", url);
  }, [chosenVariantId, variants.length]);

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
    product,
    isLoading,
    isProductEmpty,
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
