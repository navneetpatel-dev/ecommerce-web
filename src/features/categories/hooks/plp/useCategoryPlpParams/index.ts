"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  writeRepeatedSearchParam,
  FILTER_INPUT_DEBOUNCE_MS,
} from "@/features/products";
import { navigate } from "@/shared/utils/navigation/navigate";
import { useDebouncedWriteQueue } from "@/shared/hooks/ui/useDebouncedWriteQueue.hook";

export function useCategoryPlpParams(
  facetSelections: Record<string, string[]>,
) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounced writes merge onto the URL as it is at flush time — not the
  // render the keystroke came from — so a late flush cannot revive filters
  // another write already cleared.
  const latestParamsRef = useRef(searchParams);
  useEffect(() => {
    latestParamsRef.current = searchParams;
  }, [searchParams]);

  const applyWrites = useCallback(
    (writes: Record<string, unknown>) => {
      const next = new URLSearchParams(latestParamsRef.current.toString());
      for (const [key, value] of Object.entries(writes)) {
        if (value === undefined) next.delete(key);
        else if (Array.isArray(value)) {
          writeRepeatedSearchParam(next, key, value.map(String));
        } else {
          next.set(key, String(value));
        }
      }
      if (!("page" in writes)) next.delete("page");
      const query = next.toString();
      navigate(router, query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router],
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

  /** Price/rating inputs: one navigation per quiet window, all fields merged. */
  const updateFilterDebounced = useCallback(
    (key: string, value: unknown) => queue(key, value),
    [queue],
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
    // Supersede queued keystrokes so a pending flush cannot revive them.
    clear();
    const writes: Record<string, unknown> = {};
    for (const key of latestParamsRef.current.keys()) {
      if (key !== "sort") writes[key] = undefined;
    }
    if (Object.keys(writes).length > 0) applyWrites(writes);
  }, [clear, applyWrites]);

  return {
    updateFilter,
    updateFilterDebounced,
    toggleFacetValue,
    clearFilters,
  };
}
