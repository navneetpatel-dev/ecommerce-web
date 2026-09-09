/** Keep in sync with backend @core/constants/search. */
export const SEARCH_AUTOCOMPLETE_MIN_CHARS = 2;
export const SEARCH_AUTOCOMPLETE_DEBOUNCE_MS = 200;
export const SEARCH_AUTOCOMPLETE_STALE_MS = 1000 * 60;

export const SEARCH_SUGGESTION_TYPE = {
  PRODUCT: "product",
  VENDOR: "vendor",
  CATEGORY: "category",
} as const;

export type SearchPanelLayout = "dropdown" | "inline";
