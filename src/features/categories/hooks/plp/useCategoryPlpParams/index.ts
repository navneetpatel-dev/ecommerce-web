"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { writeRepeatedSearchParam } from "@/features/products";
import { navigate } from "@/shared/utils/navigation/navigate";

export function useCategoryPlpParams(
  facetSelections: Record<string, string[]>,
) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const query = next.toString();
      navigate(router, query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const updateFilter = useCallback(
    (key: string, value: unknown) => {
      pushParams((params) => {
        if (value === "" || value === null || value === undefined) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          writeRepeatedSearchParam(params, key, value.map(String));
        } else {
          params.set(key, String(value));
        }
        if (key !== "page") params.delete("page");
      });
    },
    [pushParams],
  );

  const toggleFacetValue = useCallback(
    (filterKey: string, value: string) => {
      const current = facetSelections[filterKey] ?? [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      updateFilter(filterKey, next);
    },
    [facetSelections, updateFilter],
  );

  const clearFilters = useCallback(() => {
    pushParams((params) => {
      Array.from(params.keys()).forEach((key) => {
        if (key === "sort") return;
        params.delete(key);
      });
    });
  }, [pushParams]);

  return { updateFilter, toggleFacetValue, clearFilters };
}
