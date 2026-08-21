import { useSearchParams, useRouter } from "next/navigation";
import {
  parseFilters,
  filtersToParams,
  clearFacetFilters,
} from "../utils/products.utils";
import { navigate } from "@/shared/utils/navigate";
import { useDebouncedCallback } from "@/shared/hooks/use-debounce";
import { FILTER_INPUT_DEBOUNCE_MS } from "../constants/filterTiming";
import type { ProductFilters } from "../api/products.api";

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = parseFilters(searchParams);

  const pushFilters = (next: ProductFilters | Record<string, unknown>) => {
    const params = filtersToParams(next as Record<string, unknown>);
    const query = params.toString();
    navigate(router, query ? `?${query}` : window.location.pathname);
  };

  const updateFilter = (key: string, value: unknown) => {
    const next = {
      ...filters,
      [key]:
        value === "" || value === null || value === undefined
          ? undefined
          : value,
      ...(key !== "page" ? { page: 1 } : {}),
    };
    pushFilters(next);
  };

  const updateFilterDebounced = useDebouncedCallback(
    updateFilter,
    FILTER_INPUT_DEBOUNCE_MS,
  );

  const clearFilters = () => {
    pushFilters(clearFacetFilters(filters));
  };

  return { filters, updateFilter, updateFilterDebounced, clearFilters };
}
