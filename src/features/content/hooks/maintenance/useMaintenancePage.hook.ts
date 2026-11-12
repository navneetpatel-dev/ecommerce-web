"use client";

import { useState } from "react";
import { usePublicSettings } from "@/shared/hooks/usePublicSettings.hook";
import { LABELS } from "@/shared/constants/labels";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

/** The admin's maintenance message and expected end time (B-11), with the generic copy as fallback. */
export function useMaintenancePage() {
  const { data: settings } = usePublicSettings();
  const [now] = useState(() => Date.now());
  const message =
    settings?.maintenanceMessage?.trim() || LABELS.maintenanceBody;
  const until = settings?.maintenanceUntil;
  const untilDate = until ? new Date(until) : null;
  const backBy =
    untilDate && !Number.isNaN(untilDate.getTime()) && untilDate.getTime() > now
      ? formatLabel(LABELS.maintenanceBackBy, {
          time: formatDateTime(untilDate),
        })
      : null;
  return { message, backBy };
}
