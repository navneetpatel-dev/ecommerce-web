import { get, set } from "idb-keyval";
import { deliveryAgentApi } from "../api/deliveryAgent.api";

const QUEUE_KEY = "delivery-offline-queue:status-updates";

export type QueuedStatusUpdateInput =
  | { kind: "delivery"; shipmentId: string; status: string; note?: string }
  | { kind: "pickup"; returnId: string; note: string };

export type QueuedStatusUpdate = QueuedStatusUpdateInput & { queuedAt: number };

async function readQueue(): Promise<QueuedStatusUpdate[]> {
  try {
    return (await get(QUEUE_KEY)) ?? [];
  } catch {
    return [];
  }
}

async function writeQueue(queue: QueuedStatusUpdate[]): Promise<void> {
  try {
    await set(QUEUE_KEY, queue);
  } catch {
    // Best-effort.
  }
}

const SYNC_TAG = "delivery-status-sync";

/**
 * Registers a Background Sync request so the browser retries even if the tab
 * closes before connectivity returns (Chrome/Edge; feature-detected — other
 * browsers fall back to the `online` event listener in useOfflineQueueSync).
 * The SW itself never does the authenticated fetch — it just wakes any open
 * page via postMessage, which flushes with its own in-memory session token.
 */
async function registerBackgroundSync(): Promise<void> {
  if (!("serviceWorker" in navigator) || !("SyncManager" in window)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    await (
      registration as ServiceWorkerRegistration & {
        sync: { register: (tag: string) => Promise<void> };
      }
    ).sync.register(SYNC_TAG);
  } catch {
    // Best-effort — the online-event listener still covers this case.
  }
}

/** Called instead of the live API call when the agent is offline. */
export async function enqueueStatusUpdate(
  action: QueuedStatusUpdateInput,
): Promise<void> {
  const queue = await readQueue();
  queue.push({ ...action, queuedAt: Date.now() });
  await writeQueue(queue);
  void registerBackgroundSync();
}

export async function pendingOfflineActionCount(): Promise<number> {
  return (await readQueue()).length;
}

/** Replays queued status updates once connectivity returns; entries the server rejects are dropped. */
export async function flushOfflineQueue(): Promise<number> {
  const queue = await readQueue();
  if (!queue.length) return 0;

  let flushed = 0;
  const remaining: QueuedStatusUpdate[] = [];
  for (const action of queue) {
    try {
      if (action.kind === "delivery") {
        await deliveryAgentApi.updateDeliveryStatus(action.shipmentId, {
          status: action.status,
          note: action.note,
        });
      } else {
        await deliveryAgentApi.updatePickupStatus(action.returnId, action.note);
      }
      flushed += 1;
    } catch {
      // Stale/invalid transition (e.g. status already advanced by then) — drop it
      // rather than retrying forever; a fresh manual update covers the gap.
    }
  }
  await writeQueue(remaining);
  return flushed;
}

export function isOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}
