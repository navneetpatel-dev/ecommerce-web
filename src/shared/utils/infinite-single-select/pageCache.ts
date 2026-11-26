/**
 * A small time-limited cache for dropdown pages: scrolling back or reopening reuses a page, a minute
 * later it is fetched again so new records appear, and it never holds more than `maxEntries`.
 */
export function createPageCache<T>(ttlMs = 60 * 1000, maxEntries = 100) {
  const entries = new Map<string, { at: number; value: T }>();
  return {
    get(key: string): T | null {
      const hit = entries.get(key);
      if (!hit) return null;
      if (Date.now() - hit.at > ttlMs) {
        entries.delete(key);
        return null;
      }
      return hit.value;
    },
    set(key: string, value: T): void {
      if (entries.size >= maxEntries) {
        const oldest = entries.keys().next().value;
        if (oldest !== undefined) entries.delete(oldest);
      }
      entries.set(key, { at: Date.now(), value });
    },
  };
}
