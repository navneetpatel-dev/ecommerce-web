import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "./categories.api";

export const categoryKeys = {
  all: ["categories"] as const,
  resolve: (path: string) => [...categoryKeys.all, "resolve", path] as const,
  facets: (
    categoryId: string | undefined,
    selections: Record<string, string[]>,
  ) => [...categoryKeys.all, "facets", categoryId, selections] as const,
};

export function useCategories(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoriesApi.list(),
    staleTime: 1000 * 60 * 5,
    enabled: options.enabled ?? true,
  });
}
