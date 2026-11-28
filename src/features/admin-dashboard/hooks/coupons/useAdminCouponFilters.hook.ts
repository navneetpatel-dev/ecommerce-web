"use client";

import { useUrlFilterParams } from "@/shared/hooks/navigation/useUrlFilterParams.hook";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";

const FILTER_KEYS = ["search", "status", "type", "vendorId"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

/** The coupon list filters, kept in the URL; any change goes back to the first page. */
export function useAdminCouponFilters(resetPage: () => void) {
  const urlFilters = useUrlFilterParams<FilterKey>({ search: ["q"] });
  const search = urlFilters.get("search");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const change = (key: FilterKey) => (value: string) => {
    urlFilters.set(key)(value);
    resetPage();
  };

  const clear = () => {
    urlFilters.clearAll([...FILTER_KEYS]);
    resetPage();
  };

  return {
    debouncedSearch,
    values: {
      search,
      status: urlFilters.get("status"),
      type: urlFilters.get("type"),
      vendorId: urlFilters.get("vendorId"),
    },
    onSearchChange: change("search"),
    onStatusChange: change("status"),
    onTypeChange: change("type"),
    onVendorChange: change("vendorId"),
    onClear: clear,
  };
}
