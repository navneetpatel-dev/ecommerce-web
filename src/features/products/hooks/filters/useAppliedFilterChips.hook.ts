"use client";

import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { ProductFilters } from "../../api/listing/products.api";
import type { AppliedFilterChip } from "../../types/filters/appliedFilterChip.types";

interface UseAppliedFilterChipsParams {
  filters: ProductFilters;
  /** Clears several facet keys in one URL write (price range). */
  removeFilters: (keys: string[]) => void;
  /** Drops one selected value of one attribute facet. */
  removeAttrValue: (attrKey: string, value: string) => void;
  categoryName?: string;
  vendorName?: string;
}

/** Derives the removable chips shown above the PLP result grid. */
export function useAppliedFilterChips({
  filters,
  removeFilters,
  removeAttrValue,
  categoryName,
  vendorName,
}: UseAppliedFilterChipsParams): AppliedFilterChip[] {
  return useMemo(() => {
    const chips: AppliedFilterChip[] = [];

    if (filters.search) {
      chips.push({
        id: "search",
        label: formatLabel(LABELS.activeFilterSearch, {
          value: filters.search,
        }),
        onRemove: () => removeFilters(["search"]),
      });
    }

    if (filters.categoryId) {
      chips.push({
        id: "categoryId",
        label: formatLabel(LABELS.activeFilterCategory, {
          value: categoryName ?? LABELS.category,
        }),
        onRemove: () => removeFilters(["categoryId"]),
      });
    }

    if (filters.vendorId) {
      chips.push({
        id: "vendorId",
        label: formatLabel(LABELS.activeFilterVendor, {
          value: vendorName ?? LABELS.vendors,
        }),
        onRemove: () => removeFilters(["vendorId"]),
      });
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      chips.push({
        id: "price",
        label: formatLabel(LABELS.activeFilterPrice, {
          range: priceRangeLabel(filters.minPrice, filters.maxPrice),
        }),
        onRemove: () => removeFilters(["minPrice", "maxPrice"]),
      });
    }

    if (filters.rating !== undefined) {
      chips.push({
        id: "rating",
        label: formatLabel(LABELS.activeFilterRating, {
          value: filters.rating,
        }),
        onRemove: () => removeFilters(["rating"]),
      });
    }

    for (const [attrKey, values] of Object.entries(filters.attrs ?? {})) {
      for (const value of values) {
        chips.push({
          id: `${attrKey}:${value}`,
          label: formatLabel(LABELS.activeFilterAttribute, {
            name: attrKey,
            value,
          }),
          onRemove: () => removeAttrValue(attrKey, value),
        });
      }
    }

    return chips;
  }, [filters, removeFilters, removeAttrValue, categoryName, vendorName]);
}

/** Shared money formatter — the ₹ glyph stays inside the formatting utils. */
function priceRangeLabel(min?: number, max?: number): string {
  if (min !== undefined && max !== undefined) {
    return `${formatInr(min)} – ${formatInr(max)}`;
  }
  if (min !== undefined) {
    return formatLabel(LABELS.activeFilterPriceFrom, {
      amount: formatInr(min),
    });
  }
  return formatLabel(LABELS.activeFilterPriceUpTo, {
    amount: formatInr(max),
  });
}
