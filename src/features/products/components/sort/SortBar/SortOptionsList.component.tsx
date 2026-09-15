import { SelectItem } from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";

// "Popular" is deliberately not offered here: the backend (products.repository.ts's
// buildListOrder) maps trending/popular/rating to the identical `avgRating DESC, createdAt DESC`
// query — no separate popularity signal (order/view counts) exists yet. Keeping both "Trending"
// and "Popular" as user-selectable options would silently produce the same results for either
// choice, reading as broken sorting. "Top Rated" stays: it genuinely does sort by rating.
export const SORT_OPTIONS = [
  { value: "trending", labelKey: "sortTrending" as const },
  { value: "newest", labelKey: "sortNewest" as const },
  { value: "price_asc", labelKey: "sortPriceLowHigh" as const },
  { value: "price_desc", labelKey: "sortPriceHighLow" as const },
  { value: "rating", labelKey: "sortTopRated" as const },
] as const;

export function SortOptionsList() {
  return (
    <>
      {SORT_OPTIONS.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {LABELS[option.labelKey]}
        </SelectItem>
      ))}
    </>
  );
}
