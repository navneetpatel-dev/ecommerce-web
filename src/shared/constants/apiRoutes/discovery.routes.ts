/** Frontend discovery/misc API path builders — must stay aligned with backend mounts under `/api`. */
export const searchRoutes = {
  root: "/api/search",
  autocomplete: (term: string) =>
    `/api/search/autocomplete?q=${encodeURIComponent(term)}`,
  query: (term: string, page: number) =>
    `/api/search?q=${encodeURIComponent(term)}&page=${page}`,
} as const;

export const newsletterRoutes = {
  subscribe: "/api/newsletter/subscribe",
} as const;

export const webVitalsRoutes = {
  record: "/api/web-vitals",
} as const;
