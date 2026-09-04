import { get, set } from "idb-keyval";

/**
 * Dedicated IndexedDB cache for the agent's own assigned tasks — kept
 * separate from the app-wide query persister, which deliberately excludes
 * delivery data because it carries customer PII (see queryPersister.ts).
 * This cache holds only what the signed-in agent already fetched for
 * themselves, so persisting it here carries the same trust boundary as the
 * live API response.
 */
const PREFIX = "delivery-offline-cache:";

export async function cacheDeliverySnapshot<T>(
  key: string,
  data: T,
): Promise<void> {
  try {
    await set(`${PREFIX}${key}`, data);
  } catch {
    // Best-effort — IndexedDB can be unavailable (private browsing, quota).
  }
}

export async function getCachedDeliverySnapshot<T>(
  key: string,
): Promise<T | null> {
  try {
    const value = await get(`${PREFIX}${key}`);
    return (value as T) ?? null;
  } catch {
    return null;
  }
}
