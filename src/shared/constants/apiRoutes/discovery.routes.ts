export interface SearchProductsRouteParams {
  q: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
}

/** Frontend discovery/misc API path builders — must stay aligned with backend mounts under `/api`. */
export const searchRoutes = {
  root: "/api/search",
  autocomplete: (term: string) =>
    `/api/search/autocomplete?q=${encodeURIComponent(term)}`,
  query: (params: SearchProductsRouteParams) => {
    const sp = new URLSearchParams();
    sp.set("q", params.q);
    if (params.page) sp.set("page", String(params.page));
    if (params.limit) sp.set("limit", String(params.limit));
    if (params.categoryId) sp.set("categoryId", params.categoryId);
    if (params.vendorId) sp.set("vendorId", params.vendorId);
    if (params.minPrice != null) sp.set("minPrice", String(params.minPrice));
    if (params.maxPrice != null) sp.set("maxPrice", String(params.maxPrice));
    return `/api/search?${sp.toString()}`;
  },
} as const;

export const newsletterRoutes = {
  subscribe: "/api/newsletter/subscribe",
} as const;

export const webVitalsRoutes = {
  record: "/api/web-vitals",
  summary: "/api/web-vitals/summary",
} as const;
