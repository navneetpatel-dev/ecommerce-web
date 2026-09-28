import { useCallback, useMemo } from "react";
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
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const pushFilters = useCallback(
    (next: ProductFilters | Record<string, unknown>) => {
      const params = filtersToParams(next as Record<string, unknown>);
      const query = params.toString();
      navigate(router, query ? `?${query}` : window.location.pathname);
    },
    [router],
  );

  const updateFilter = useCallback(
    (key: string, value: unknown) => {
      const next = {
        ...filters,
        [key]:
          value === "" || value === null || value === undefined
            ? undefined
            : value,
        ...(key !== "page" ? { page: 1 } : {}),
      };
      pushFilters(next);
    },
    [filters, pushFilters],
  );

  const updateFilterDebounced = useDebouncedCallback(
    updateFilter,
    FILTER_INPUT_DEBOUNCE_MS,
  );

  /** Clear several facets in one URL write (e.g. a price range's two keys). */
  const removeFilters = useCallback(
    (keys: string[]) => {
      const next: Record<string, unknown> = { ...filters, page: 1 };
      for (const key of keys) next[key] = undefined;
      pushFilters(next);
    },
    [filters, pushFilters],
  );

  /** Drop one selected value of one attribute facet, keeping the rest. */
  const removeAttrValue = useCallback(
    (attrKey: string, value: string) => {
      const remaining = (filters.attrs?.[attrKey] ?? []).filter(
        (entry) => entry !== value,
      );
      const nextAttrs = { ...(filters.attrs ?? {}) };
      if (remaining.length > 0) nextAttrs[attrKey] = remaining;
      else delete nextAttrs[attrKey];
      pushFilters({
        ...filters,
        attrs: Object.keys(nextAttrs).length > 0 ? nextAttrs : undefined,
        page: 1,
      });
    },
    [filters, pushFilters],
  );

  const clearFilters = useCallback(() => {
    pushFilters(clearFacetFilters(filters));
  }, [filters, pushFilters]);

  return {
    filters,
    updateFilter,
    updateFilterDebounced,
    removeFilters,
    removeAttrValue,
    clearFilters,
  };
}
