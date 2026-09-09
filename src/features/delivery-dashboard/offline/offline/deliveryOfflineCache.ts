import { entries, get, set } from "idb-keyval";
import type { DeliveryPickup, DeliveryShipment } from "../../types/agent/types";

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

/**
 * Optimistically mutates both the single-delivery snapshot and all cached
 * delivery task lists in IndexedDB so the UI reflects status updates even
 * with zero connectivity.
 */
export async function updateCachedDeliveryStatus(
  shipmentId: string,
  status: string,
  note?: string,
): Promise<void> {
  try {
    const allEntries = await entries();
    for (const [rawKey, val] of allEntries) {
      const k = String(rawKey);
      if (!k.startsWith(PREFIX)) continue;

      if (
        k === `${PREFIX}delivery:${shipmentId}` &&
        val &&
        typeof val === "object"
      ) {
        const item = val as DeliveryShipment;
        const updated: DeliveryShipment = {
          ...item,
          status: status as DeliveryShipment["status"],
          failureReason:
            status === "FAILED"
              ? (note ?? item.failureReason)
              : item.failureReason,
        };
        await set(k, updated);
      } else if (k.startsWith(`${PREFIX}deliveries:`) && Array.isArray(val)) {
        const updatedList = (val as DeliveryShipment[]).map((shipment) => {
          if (shipment.id !== shipmentId) return shipment;
          return {
            ...shipment,
            status: status as DeliveryShipment["status"],
            failureReason:
              status === "FAILED"
                ? (note ?? shipment.failureReason)
                : shipment.failureReason,
          };
        });
        await set(k, updatedList);
      }
    }
  } catch {
    // Best-effort optimistic cache update.
  }
}

/**
 * Optimistically mutates pickup task snapshots in IndexedDB so the UI reflects
 * offline attempts without needing a live network round-trip.
 */
export async function updateCachedPickupStatus(
  returnId: string,
  note: string,
): Promise<void> {
  try {
    const allEntries = await entries();
    for (const [rawKey, val] of allEntries) {
      const k = String(rawKey);
      if (!k.startsWith(PREFIX)) continue;

      if (
        k === `${PREFIX}pickup:${returnId}` &&
        val &&
        typeof val === "object"
      ) {
        const item = val as DeliveryPickup;
        const updated: DeliveryPickup = {
          ...item,
          pickupFailureReason: note,
        };
        await set(k, updated);
      } else if (k.startsWith(`${PREFIX}pickups:`) && Array.isArray(val)) {
        const updatedList = (val as DeliveryPickup[]).map((pickup) => {
          if (pickup.id !== returnId) return pickup;
          return {
            ...pickup,
            pickupFailureReason: note,
          };
        });
        await set(k, updatedList);
      }
    }
  } catch {
    // Best-effort optimistic cache update.
  }
}
