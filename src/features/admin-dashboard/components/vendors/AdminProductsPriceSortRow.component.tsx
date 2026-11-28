"use client";

import { LABELS } from "@/shared/constants/labels";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";

export interface AdminProductsPriceSortRowProps {
  inStock?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  onInStockChange?: (val: string) => void;
  onMinPriceChange?: (val: string) => void;
  onMaxPriceChange?: (val: string) => void;
  onSortChange?: (val: string) => void;
}

const ALL_OPTION = "__ALL__";

const SORT_OPTIONS = [
  { value: ALL_OPTION, label: "Default Sort" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "trending", label: "Trending / Popular" },
];

const STOCK_OPTIONS = [
  { value: ALL_OPTION, label: "All Inventory" },
  { value: "in_stock", label: "In Stock Only" },
  { value: "out_of_stock", label: "Out of Stock" },
];

export function AdminProductsPriceSortRow(
  props: AdminProductsPriceSortRowProps,
) {
  const {
    inStock = "",
    minPrice = "",
    maxPrice = "",
    sort = "",
    onInStockChange,
    onMinPriceChange,
    onMaxPriceChange,
    onSortChange,
  } = props;

  const handleSelect = (setter?: (val: string) => void) => (val: string) => {
    setter?.(val === ALL_OPTION ? "" : val);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end pt-1">
      <FormFieldFrame label="Inventory" htmlFor="admin-products-stock">
        <Select
          value={inStock || ALL_OPTION}
          onValueChange={handleSelect(onInStockChange)}
        >
          <SelectTrigger id="admin-products-stock">
            <SelectValue placeholder="All Inventory" />
          </SelectTrigger>
          <SelectContent>
            {STOCK_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.priceFilterMinLabel}
        htmlFor="admin-products-min-price"
      >
        <Input
          id="admin-products-min-price"
          type="number"
          min={0}
          placeholder={LABELS.priceFilterMinPlaceholder}
          value={minPrice}
          onChange={(e) => onMinPriceChange?.(e.target.value)}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.priceFilterMaxLabel}
        htmlFor="admin-products-max-price"
      >
        <Input
          id="admin-products-max-price"
          type="number"
          min={0}
          placeholder={LABELS.priceFilterMaxPlaceholder}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange?.(e.target.value)}
        />
      </FormFieldFrame>

      <FormFieldFrame label="Sort By" htmlFor="admin-products-sort">
        <Select
          value={sort || ALL_OPTION}
          onValueChange={handleSelect(onSortChange)}
        >
          <SelectTrigger id="admin-products-sort">
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
