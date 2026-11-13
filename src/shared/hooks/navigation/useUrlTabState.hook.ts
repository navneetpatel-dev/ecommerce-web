"use client";

import { useSearchParams } from "next/navigation";
import { preserveScrollOnNextNavigation } from "@/shared/utils/navigation/scrollMemory";

/**
 * A tab kept in the URL (`?tab=reviews`), so Back/Forward and shared links land
 * on the same tab. Switching uses `history.replaceState` (Next keeps
 * `useSearchParams` in sync) — no history entry per click, no server round-trip,
 * and the scroll position stays put.
 */
export function useUrlTabState<T extends string>(
  allowed: readonly T[],
  fallback: T,
  param = "tab",
) {
  const searchParams = useSearchParams();
  const raw = searchParams?.get(param) ?? null;
  const value = (allowed as readonly string[]).includes(raw ?? "")
    ? (raw as T)
    : fallback;

  const setValue = (next: string) => {
    if (next === value) return;
    const url = new URL(window.location.href);
    if (next === fallback) url.searchParams.delete(param);
    else url.searchParams.set(param, next);
    preserveScrollOnNextNavigation();
    window.history.replaceState(
      // null, not history.state: Next syncs useSearchParams only for calls that
      // do not carry its own internal state.
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  };

  return [value, setValue] as const;
}
