import {
  cacheDeliverySnapshot,
  getCachedDeliverySnapshot,
} from "../offline/deliveryOfflineCache";

export function statusQuery(statuses?: string[]): string {
  return statuses?.length
    ? `?status=${encodeURIComponent(statuses.join(","))}`
    : "";
}

/** Read-through IndexedDB cache so today's task list still renders with no connectivity. */
export async function withOfflineCache<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  try {
    const fresh = await fetcher();
    void cacheDeliverySnapshot(cacheKey, fresh);
    return fresh;
  } catch (error) {
    const cached = await getCachedDeliverySnapshot<T>(cacheKey);
    if (cached !== null) return cached;
    throw error;
  }
}
