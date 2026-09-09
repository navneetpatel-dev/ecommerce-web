import { useOfflineQueueSync } from "../../offline/offline/useOfflineQueueSync.hook";

export function useOfflineSyncBanner() {
  const { isOnline, pendingCount } = useOfflineQueueSync();

  const shouldRenderBanner = !(isOnline && pendingCount === 0);
  const pendingUpdateNoun = pendingCount === 1 ? "" : "s";
  const statusMessage = !isOnline
    ? "You're offline. Today's tasks are cached and status updates will sync automatically once you're back online."
    : `Syncing ${pendingCount} queued update${pendingUpdateNoun}...`;

  return {
    shouldRenderBanner,
    statusMessage,
  };
}
