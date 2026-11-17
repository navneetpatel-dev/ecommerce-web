"use client";

import { useCallback } from "react";
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

  const hrefWith = useCallback(
    (updates: QueryUpdates): string => {
      const query = nextQuery(searchParams, updates).toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams],
  );

  const update = useCallback(
    (updates: QueryUpdates) => {
      const next = nextQuery(searchParams, updates);
      // Prevent redundant navigation and infinite re-render loops if query is unchanged
      if (next.toString() === searchParams.toString()) {
        return;
      }
      if (!("page" in updates)) preserveScrollOnNextNavigation();
      const query = next.toString();
      const targetUrl = query ? `${pathname}?${query}` : pathname;

      // Update URL without triggering server RSC reload loop
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", targetUrl);
      }
      router.replace(targetUrl, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return { searchParams, update, hrefWith };
}
