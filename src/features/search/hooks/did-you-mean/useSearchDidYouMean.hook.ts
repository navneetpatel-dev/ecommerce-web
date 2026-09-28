"use client";

import { useAutocomplete } from "../../api/search/search.queries";
import type { SearchSuggestion } from "../../types/search";

interface UseSearchDidYouMeanParams {
  term?: string;
  /** Only look for a suggestion when the listing actually came back empty. */
  hasNoResults: boolean;
}

/**
 * Top autocomplete match for a failed search term, or null. Reuses the
 * autocomplete endpoint and its minimum-length rule — no extra request fires
 * for short queries or for searches that returned results.
 */
export function useSearchDidYouMean({
  term,
  hasNoResults,
}: UseSearchDidYouMeanParams): SearchSuggestion | null {
  const query = term?.trim() ?? "";
  const { data } = useAutocomplete(query, hasNoResults && query.length > 0);

  // Never echo back the exact term the shopper already typed.
  const match = (data ?? []).find(
    (suggestion) => suggestion.name.toLowerCase() !== query.toLowerCase(),
  );

  return match ?? null;
}
