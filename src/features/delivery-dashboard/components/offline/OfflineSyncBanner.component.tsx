"use client";

import { WifiOff } from "lucide-react";
import { useOfflineSyncBanner } from "../../hooks/offline/useOfflineSyncBanner.hook";
import {
  OFFLINE_BANNER_ICON,
  OFFLINE_BANNER_ROOT,
} from "../../styles/offline/offlineSyncBanner.styles";

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
