import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  parseFilters,
  filtersToParams,
} from "../../utils/variants/products.utils";
import { FILTER_INPUT_DEBOUNCE_MS } from "../../constants/filters/filterTiming";
import { navigate } from "@/shared/utils/navigation/navigate";
import { useDebouncedWriteQueue } from "@/shared/hooks/ui/useDebouncedWriteQueue.hook";

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  // Debounced writes merge onto the URL as it is at flush time, so two fields
  // edited inside one debounce window both apply — the later call no longer
  // cancels the earlier one.
  const latestParamsRef = useRef(searchParams);
  useEffect(() => {
    latestParamsRef.current = searchParams;
  }, [searchParams]);

  const applyWrites = useCallback(
    (writes: Record<string, unknown>) => {
      const base = parseFilters(
        new URLSearchParams(latestParamsRef.current.toString()),
      );
      const next: Record<string, unknown> = { ...base, ...writes };
      if (!("page" in writes)) next.page = 1;
      const params = filtersToParams(next);
      const query = params.toString();
      navigate(router, query ? `?${query}` : window.location.pathname);
    },
    [router],
  );

  const { queue, flushNow, clear } = useDebouncedWriteQueue(
    applyWrites,
    FILTER_INPUT_DEBOUNCE_MS,
  );

  const updateFilter = useCallback(
    (key: string, value: unknown) => {
      queue(key, value);
      flushNow();
    },
    [queue, flushNow],
  );

  /** High-frequency inputs (price min/max, rating): merged into one flush. */
  const updateFilterDebounced = useCallback(
    (key: string, value: unknown) => queue(key, value),
    [queue],
  );

  /** Clear several facets in one URL write (e.g. a price range's two keys). */
  const removeFilters = useCallback(
    (keys: string[]) => {
      for (const key of keys) queue(key, undefined);
      flushNow();
    },
    [queue, flushNow],
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
      queue("attrs", Object.keys(nextAttrs).length > 0 ? nextAttrs : undefined);
      flushNow();
    },
    [filters, queue, flushNow],
  );

  const clearFilters = useCallback(() => {
    // Supersede queued keystrokes so a pending flush cannot revive them.
    clear();
    applyWrites({
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      attrs: undefined,
    });
  }, [clear, applyWrites]);

  return {
    filters,
    updateFilter,
    updateFilterDebounced,
    removeFilters,
    removeAttrValue,
    clearFilters,
  };
}
