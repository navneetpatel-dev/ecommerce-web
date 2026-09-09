import { SelectItem } from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";

export const SORT_OPTIONS = [
  { value: "trending", labelKey: "sortTrending" as const },
  { value: "popular", labelKey: "sortPopular" as const },
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
