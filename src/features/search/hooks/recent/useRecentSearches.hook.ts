"use client";

import { useCallback, useState } from "react";
import {
  addRecentSearch,
  clearStoredRecentSearches,
  readRecentSearches,
} from "../../utils/recent/recentSearches";

/** Recent search terms backed by localStorage, exposed as state for the panel. */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const refreshRecentSearches = useCallback(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  const rememberSearch = useCallback((term: string) => {
    setRecentSearches(addRecentSearch(term));
  }, []);

  const clearRecentSearches = useCallback(() => {
    clearStoredRecentSearches();
    setRecentSearches([]);
  }, []);

  return {
    recentSearches,
    refreshRecentSearches,
    rememberSearch,
    clearRecentSearches,
  };
}
