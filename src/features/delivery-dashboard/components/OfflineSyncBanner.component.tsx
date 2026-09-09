"use client";

import { WifiOff } from "lucide-react";
import { useOfflineSyncBanner } from "./OfflineSyncBanner/useOfflineSyncBanner.hook";
import {
  OFFLINE_BANNER_ICON,
  OFFLINE_BANNER_ROOT,
} from "./OfflineSyncBanner/offlineSyncBanner.styles";

/** Mounted once in the delivery dashboard layout — surfaces offline state and queued work. */
export function OfflineSyncBanner() {
  const { shouldRenderBanner, statusMessage } = useOfflineSyncBanner();

  if (!shouldRenderBanner) return null;

  return (
    <div className={OFFLINE_BANNER_ROOT}>
      <WifiOff className={OFFLINE_BANNER_ICON} aria-hidden="true" />
      {statusMessage}
    </div>
  );
}
