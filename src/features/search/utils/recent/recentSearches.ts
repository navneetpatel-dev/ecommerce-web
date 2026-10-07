import { STORAGE_KEYS } from "@/shared/constants/storage/storage";

/** How many submitted terms the panel remembers. */
const RECENT_SEARCHES_LIMIT = 5;

/** Latest submitted search terms, newest first; [] when storage is unavailable. */
export function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string")
      .slice(0, RECENT_SEARCHES_LIMIT);
  } catch {
    return [];
  }
}

/** Stores the term as most recent (case-insensitive dedupe) and returns the new list. */
export function addRecentSearch(term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return readRecentSearches();
  const next = [
    trimmed,
    ...readRecentSearches().filter(
      (item) => item.toLowerCase() !== trimmed.toLowerCase(),
    ),
  ].slice(0, RECENT_SEARCHES_LIMIT);
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.RECENT_SEARCHES,
      JSON.stringify(next),
    );
  } catch {
    /* storage unavailable (private mode) — recents stay in memory only */
  }
  return next;
}

export function clearStoredRecentSearches(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  } catch {
    /* storage unavailable — nothing to clear */
  }
}
