"use client";

import { useQuery } from "@tanstack/react-query";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { notificationsApi } from "../../api/notifications/notifications.api";

const REFRESH_MS = 60_000;

const STATUS_LABEL = {
  OK: LABELS.emailHealthOk,
  DEGRADED: LABELS.emailHealthDegraded,
  DOWN: LABELS.emailHealthDown,
} as const;

/** Email delivery health for the admin banner, refreshed every minute. */
export function useEmailHealth() {
  const query = useQuery({
    queryKey: ["admin", "email-health"],
    queryFn: () => notificationsApi.health(),
    refetchInterval: REFRESH_MS,
    staleTime: REFRESH_MS / 2,
  });
  const health = query.data;
  const failure = health?.lastFailure;

  return {
    status: health?.status ?? null,
    statusLabel: health ? STATUS_LABEL[health.status] : null,
    headline: health?.headline ?? null,
    stats: health
      ? formatLabel(LABELS.emailHealthStats, {
          minutes: health.windowMinutes,
          sent: health.sent,
          failed: health.failed,
          stuck: health.stuck,
        })
      : null,
    lastFailure:
      health?.status !== "OK" && failure?.error
        ? formatLabel(LABELS.emailHealthLastFailure, {
            category: failure.category ?? "UNKNOWN",
            error: failure.error,
          })
        : null,
    loadError: query.isError ? LABELS.emailHealthLoadFailed : null,
  };
}
