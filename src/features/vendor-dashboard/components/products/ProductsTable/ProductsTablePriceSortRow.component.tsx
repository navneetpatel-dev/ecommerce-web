"use client";

import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";

const ALL_OPTION = "__ALL__";

const SORT_OPTIONS = [
  { value: ALL_OPTION, label: "Default Sort" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "trending", label: "Trending / Popular" },
];

interface ProductsTablePriceSortRowProps {
  minPrice: string;
  onMinPriceChange?: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange?: (value: string) => void;
  sort: string;
  onSortChange?: (value: string) => void;
}

/** The price range and sort order of the vendor's product list. */
export function ProductsTablePriceSortRow({
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sort,
  onSortChange,
}: ProductsTablePriceSortRowProps) {
  const handleSortChange = (value: string) =>
    onSortChange?.(value === ALL_OPTION ? "" : value);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 items-end pt-1">
      <FormFieldFrame
        label={LABELS.priceFilterMinLabel}
        htmlFor="vendor-products-min-price"
      >
        <Input
          id="vendor-products-min-price"
          type="number"
          min={0}
          placeholder={LABELS.priceFilterMinPlaceholder}
          value={minPrice}
          onChange={(e) => onMinPriceChange?.(e.target.value)}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.priceFilterMaxLabel}
        htmlFor="vendor-products-max-price"
      >
        <Input
          id="vendor-products-max-price"
          type="number"
          min={0}
          placeholder={LABELS.priceFilterMaxPlaceholder}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange?.(e.target.value)}
        />
      </FormFieldFrame>

      <FormFieldFrame label="Sort By" htmlFor="vendor-products-sort">
        <Select value={sort || ALL_OPTION} onValueChange={handleSortChange}>
          <SelectTrigger id="vendor-products-sort">
            <SelectValue placeholder="Default Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
    </div>
  );
}
