"use client";

import { useCallback, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";

interface UseInfiniteSelectQueryStateParams {
  /** The popover's open state — re-opening restarts the initial load. */
  open: boolean;
  /** False for APIs without search (skips the debounce entirely). */
  searchable: boolean;
}

/**
 * Search text, its debounced value, and the "a fresh page-1 load is starting"
 * flag for the infinite selects. Extracted so both variants share one trigger
 * rule: a new debounced term or a re-open resets to the loading state.
 */
export function useInfiniteSelectQueryState({
  open,
  searchable,
}: UseInfiniteSelectQueryStateParams) {
  const [query, setQuery] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);
  const resetQuery = useCallback(() => setQuery(""), []);
  const debouncedQuery = useDebouncedValue(searchable ? query.trim() : "", 250);
  const [openSnapshot, setOpenSnapshot] = useState(open);
  const [querySnapshot, setQuerySnapshot] = useState(debouncedQuery);

  if (open !== openSnapshot) {
    setOpenSnapshot(open);
    if (open) setInitialLoading(true);
  }
  if (debouncedQuery !== querySnapshot) {
    setQuerySnapshot(debouncedQuery);
    if (open) setInitialLoading(true);
  }

  return {
    query,
    setQuery,
    resetQuery,
    debouncedQuery,
    initialLoading,
    setInitialLoading,
  };
}
