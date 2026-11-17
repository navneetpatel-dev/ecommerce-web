"use client";

import { cn } from "@/shared/utils/dom/cn";
import { useEmailHealth } from "../../hooks/notifications/useEmailHealth.hook";
import { emailHealthBannerStyles as styles } from "../../styles/notifications/emailHealthBanner.styles";

const TONE = {
  OK: styles.ok,
  DEGRADED: styles.degraded,
  DOWN: styles.down,
} as const;

/** Tells an admin, at a glance, whether emails are actually getting out. */
export function EmailHealthBanner() {
  const health = useEmailHealth();

  if (health.loadError) {
    return (
      <p className={cn(styles.base, styles.degraded)}>{health.loadError}</p>
    );
  }
  if (!health.status) return null;

  return (
    <div
      role={health.status === "OK" ? "status" : "alert"}
      className={cn(styles.base, TONE[health.status])}
    >
      <p className={styles.title}>{health.statusLabel}</p>
      <p className={styles.headline}>{health.headline}</p>
      <p className={styles.detail}>{health.stats}</p>
      {health.lastFailure ? (
        <p className={styles.detail}>{health.lastFailure}</p>
      ) : null}
    </div>
  );
}
