"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useProduct } from "../../../api/listing/products.queries";
import { useProductDetailSelection } from "../useProductDetailSelection.hook";
import { useCategories } from "@/features/categories";
import { usePublicSettings } from "@/shared/hooks/usePublicSettings.hook";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";

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

  const {
    variants,
    basePrice,
    selection,
    resolvedVariantId,
    maxQuantity,
    needsOptionSelection,
    variantUnavailable,
    canAddToCart,
  } = useProductDetailSelection(product, { initialVariantId: urlVariantId });

  // Keep the chosen variant in the URL so reload and shared links keep it.
  const chosenVariantId = selection.selectedVariant?.id ?? null;
  useEffect(() => {
    if (!chosenVariantId || variants.length < 2) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get(VARIANT_QUERY_PARAM) === chosenVariantId) return;
    url.searchParams.set(VARIANT_QUERY_PARAM, chosenVariantId);
    window.history.replaceState(window.history.state, "", url);
  }, [chosenVariantId, variants.length]);

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
