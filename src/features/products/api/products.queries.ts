import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchApi } from "@/features/search";
import {
  productsApi,
  type ProductFilters,
  type ProductListResponse,
} from "./products.api";

export const productKeys = {
  all: ["products"] as const,
  list: (filters: ProductFilters) =>
    [...productKeys.all, "list", filters] as const,
  detail: (idOrSlug: string) =>
    [...productKeys.all, "detail", idOrSlug] as const,
  /** Authenticated caller's server-backed recently-viewed history. */
  recentlyViewed: () => [...productKeys.all, "recently-viewed"] as const,
  /** Precomputed "frequently bought together" rail for one product. */
  frequentlyBoughtTogether: (productId: string) =>
    [...productKeys.all, "frequently-bought-together", productId] as const,
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function fetchProduct(idOrSlug: string) {
  return UUID_RE.test(idOrSlug)
    ? productsApi.detail(idOrSlug)
    : productsApi.detailBySlug(idOrSlug);
}

/**
 * A search term routes to the ranked full-text `GET /api/search` endpoint instead of the
 * weak `ILIKE` filter on `GET /api/products` — same `ProductFilters` in, same paginated
 * `ProductListResponse` shape out, so the listing page and grid don't need to branch.
 * `sort`/`rating`/`attrs` aren't supported by the search endpoint (relevance-ranked) and are
 * dropped in that path.
 */
function fetchProductList(
  filters: ProductFilters,
): Promise<ProductListResponse> {
  const term = filters.search?.trim();
  if (term) {
    return searchApi.search({
      q: term,
      page: filters.page,
      limit: filters.limit,
      categoryId: filters.categoryId,
      vendorId: filters.vendorId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }
  return productsApi.list(filters);
}

export function useProduct(
  idOrSlug: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: productKeys.detail(idOrSlug),
    queryFn: () => fetchProduct(idOrSlug),
    enabled: !!idOrSlug && (options.enabled ?? true),
    staleTime: 1000 * 60,
  });
}

export function useProductList(
  filters: ProductFilters,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProductList(filters),
    placeholderData: (prev) => prev,
    enabled: options.enabled ?? true,
    staleTime: 1000 * 30,
  });
}

/** Authenticated-only. Server-backed recently-viewed history — the guest fallback is localStorage. */
export function useRecentlyViewedQuery(enabled: boolean) {
  return useQuery({
    queryKey: productKeys.recentlyViewed(),
    queryFn: () => productsApi.recentlyViewed(),
    enabled,
    staleTime: 1000 * 60,
  });
}

/** Public. Precomputed "frequently bought together" products for the PDP rail. */
export function useFrequentlyBoughtTogether(
  productId: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: productKeys.frequentlyBoughtTogether(productId),
    queryFn: () => productsApi.frequentlyBoughtTogether(productId),
    enabled: !!productId && (options.enabled ?? true),
    staleTime: 1000 * 60,
  });
}

export function usePrefetchProduct() {
  const queryClient = useQueryClient();
  return (idOrSlug: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(idOrSlug),
      queryFn: () => fetchProduct(idOrSlug),
    });
  };
}
