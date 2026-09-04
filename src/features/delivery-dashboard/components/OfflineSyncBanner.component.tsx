"use client";

import { WifiOff } from "lucide-react";
import { useOfflineQueueSync } from "../offline/useOfflineQueueSync.hook";

/** Mounted once in the delivery dashboard layout — surfaces offline state and queued work. */
export function OfflineSyncBanner() {
  const { isOnline, pendingCount } = useOfflineQueueSync();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className="flex items-center gap-2 border-b border-line bg-warning/10 px-4 py-2 text-body-sm text-ink">
      <WifiOff className="size-4 text-warning" aria-hidden="true" />
      {!isOnline
        ? "You're offline. Today's tasks are cached and status updates will sync automatically once you're back online."
        : `Syncing ${pendingCount} queued update${pendingCount === 1 ? "" : "s"}...`}
    </div>
  );
}
