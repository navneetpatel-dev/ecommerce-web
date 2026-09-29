"use client";

import { LABELS } from "@/shared/constants/labels";
import { useOnlineStatus } from "@/shared/hooks/ui/useOnlineStatus.hook";
import { offlineNoticeStyles as styles } from "@/shared/styles/system/offlineNotice.styles";

/**
 * Tells the customer the page they are looking at may be stale. Without it the
 * persisted query cache happily renders yesterday's prices and stock with no
 * hint that they are not live (React Query still refetches on reconnect, and
 * the service worker serves a saved fallback page for navigations).
 */
export function OfflineNotice() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div role="status" aria-live="polite" className={styles.root}>
      <span className={styles.title}>{LABELS.offlineNoticeTitle}</span>
      <span className={styles.body}>{LABELS.offlineNoticeBody}</span>
    </div>
  );
}
