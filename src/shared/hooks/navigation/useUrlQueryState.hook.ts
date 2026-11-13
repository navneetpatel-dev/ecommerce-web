"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { preserveScrollOnNextNavigation } from "@/shared/utils/navigation/scrollMemory";

export type QueryUpdates = Record<string, string | number | null | undefined>;

/** Applies updates to a copy of the current query (null/"" removes a key). */
function nextQuery(current: URLSearchParams, updates: QueryUpdates) {
  const next = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === "") next.delete(key);
    else next.set(key, String(value));
  }
  // Any filter change restarts paging unless the update sets the page itself.
  if (!("page" in updates)) next.delete("page");
  return next;
}

/**
 * Filters and paging that live in the URL, so a filtered list can be shared,
 * reloaded and walked with Back. `update` replaces the entry (no history spam);
 * `hrefWith` builds the same URL for a plain link.
 */
export function useUrlQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefWith = (updates: QueryUpdates): string => {
    const query = nextQuery(searchParams, updates).toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const update = (updates: QueryUpdates) => {
    // A filter/sort change keeps the reader where they are; a new page starts at the top.
    if (!("page" in updates)) preserveScrollOnNextNavigation();
    router.replace(hrefWith(updates), { scroll: false });
  };

  return { searchParams, update, hrefWith };
}
