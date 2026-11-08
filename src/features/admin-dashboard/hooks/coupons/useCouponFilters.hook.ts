"use client";

import { useDeferredValue, useState, type ChangeEvent } from "react";

const ALL = "all";

/** Search, status and type controls for a coupon table (Rule 1: state lives in hooks). */
export function useCouponFilters(onChange?: () => void) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [type, setType] = useState(ALL);
  const deferredSearch = useDeferredValue(search.trim());

  return {
    search,
    status,
    type,
    query: {
      search: deferredSearch || undefined,
      status: status === ALL ? undefined : status,
      type: type === ALL ? undefined : type,
    },
    onSearchChange: (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      onChange?.();
    },
    onStatusChange: (next: string) => {
      setStatus(next);
      onChange?.();
    },
    onTypeChange: (next: string) => {
      setType(next);
      onChange?.();
    },
  };
}

export type CouponFilters = ReturnType<typeof useCouponFilters>;
