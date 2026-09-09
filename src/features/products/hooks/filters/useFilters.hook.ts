import { useSearchParams, useRouter } from "next/navigation";
import {
  parseFilters,
  filtersToParams,
  clearFacetFilters,
} from "../../utils/variants/products.utils";
import { navigate } from "@/shared/utils/navigation/navigate";
import { useDebouncedCallback } from "@/shared/hooks/ui/use-debounce.hook";
import { FILTER_INPUT_DEBOUNCE_MS } from "../../constants/filters/filterTiming";
import type { ProductFilters } from "../../api/listing/products.api";

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
