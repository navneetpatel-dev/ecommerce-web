"use client";

import { useMemo } from "react";
import { useMounted } from "@/shared/hooks/ui/useMounted.hook";
import { useQueries } from "@tanstack/react-query";
import type { ProductListItem } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { productsApi } from "../../api/listing/products.api";
import {
  productKeys,
  useRecentlyViewedQuery,
} from "../../api/listing/products.queries";
import {
  productDetailToListItem,
  productNeedsVariantHydration,
} from "../../utils/card/productListItem";
import { getRecentlyViewedProducts } from "../../utils/related/recently-viewed";

/**
 * Logged-in shoppers get server-backed history (follows them across devices);
 * guests keep the untouched localStorage path. See recently-viewed.ts.
 */
export function useRecentlyViewed(limit = 8) {
  const isAuthenticated = useAuthStore((s) => Boolean(s.accessToken));
  const serverQuery = useRecentlyViewedQuery(isAuthenticated);

  const mounted = useMounted();

  // Guests read localStorage after hydration only (client-only source; the
  // mounted gate keeps SSR and the first client render identical).
  const stored = useMemo(
    () =>
      mounted && !isAuthenticated
        ? getRecentlyViewedProducts().slice(0, limit)
        : [],
    [mounted, isAuthenticated, limit],
  );

  const slugsToHydrate = useMemo(
    () =>
      isAuthenticated
        ? []
        : stored
            .filter(productNeedsVariantHydration)
            .map((product) => product.slug || product.id)
            .filter(Boolean),
    [stored, isAuthenticated],
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

  const guestProducts = useMemo(
    () =>
      stored.map((item) => {
        const key = item.slug || item.id;
        return hydratedBySlug.get(key) ?? item;
      }),
    [stored, hydratedBySlug],
  );

  if (isAuthenticated) {
    return { products: (serverQuery.data ?? []).slice(0, limit) };
  }
  return { products: guestProducts };
}
