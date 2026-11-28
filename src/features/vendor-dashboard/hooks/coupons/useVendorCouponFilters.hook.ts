"use client";

import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";

/** Search, status and type of the vendor coupon list; any change goes back to page one. */
export function useVendorCouponFilters(resetPage: () => void) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const query = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status || undefined,
      type: type || undefined,
    }),
    [debouncedSearch, status, type],
  );

  const change = (apply: (value: string) => void) => (value: string) => {
    apply(value);
    resetPage();
  };

  const onClear = () => {
    setSearch("");
    setStatus("");
    setType("");
    resetPage();
  };

  return {
    query,
    controls: {
      search,
      status,
      type,
      onSearchChange: change(setSearch),
      onStatusChange: change(setStatus),
      onTypeChange: change(setType),
      onClear,
    },
  };
}
