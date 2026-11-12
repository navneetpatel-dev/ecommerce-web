"use client";

import { useState, type ChangeEvent } from "react";
import { flattenPages } from "@/shared/api/client/pagination";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { useStorefrontVendorsInfinite } from "../../api/directory/vendors.queries";

const SEARCH_DEBOUNCE_MS = 300;

/** All shops: a name search and Load more over the whole list (B-59). */
export function useVendorsIndexPage() {
  const [term, setTerm] = useState("");
  const search = useDebouncedValue(term.trim(), SEARCH_DEBOUNCE_MS);
  const query = useStorefrontVendorsInfinite(search);
  const vendors = flattenPages(query.data);
  const total = query.data?.pages[0]?.total ?? 0;
  const noResults = !query.isLoading && vendors.length === 0;

  const handleTermChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTerm(event.target.value);
  const clearSearch = () => setTerm("");
  const loadMore = () => void query.fetchNextPage();

  return {
    term,
    search,
    vendors,
    total,
    isLoading: query.isLoading,
    isEmpty: noResults && !search,
    noMatches: noResults && Boolean(search),
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    handleTermChange,
    clearSearch,
    loadMore,
  };
}
