"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import type { ProductListItem } from "@/shared/api/types";
import { productsApi } from "../api/products.api";
import { productKeys } from "../api/products.queries";
import {
  productDetailToListItem,
  productNeedsVariantHydration,
} from "../utils/productListItem";
import { getRecentlyViewedProducts } from "../utils/recently-viewed";

export function useRecentlyViewed(limit = 8) {
  const [stored, setStored] = useState<ProductListItem[]>([]);

  useEffect(() => {
    setStored(getRecentlyViewedProducts().slice(0, limit));
  }, [limit]);

  const slugsToHydrate = useMemo(
    () =>
      stored
        .filter(productNeedsVariantHydration)
        .map((product) => product.slug || product.id)
        .filter(Boolean),
    [stored],
  );

  const hydrationQueries = useQueries({
    queries: slugsToHydrate.map((slug) => ({
      queryKey: productKeys.detail(slug),
      queryFn: () => productsApi.detailBySlug(slug),
      staleTime: 60_000,
      enabled: Boolean(slug),
    })),
  });

  const hydratedBySlug = useMemo(() => {
    const map = new Map<string, ProductListItem>();
    hydrationQueries.forEach((query, index) => {
      if (!query.data) return;
      map.set(slugsToHydrate[index], productDetailToListItem(query.data));
    });
    return map;
  }, [hydrationQueries, slugsToHydrate]);

  const products = useMemo(
    () =>
      stored.map((item) => {
        const key = item.slug || item.id;
        return hydratedBySlug.get(key) ?? item;
      }),
    [stored, hydratedBySlug],
  );

  return { products };
}
