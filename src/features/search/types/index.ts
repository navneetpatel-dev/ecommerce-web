export type SearchSuggestionType = "product" | "vendor" | "category";

export interface SearchSuggestion {
  type: SearchSuggestionType;
  id: string;
  slug: string;
  name: string;
  /** Slash-separated category slug path when type is category. */
  path?: string | null;
  imageUrl?: string;
  basePrice?: number;
  sku?: string | null;
}
