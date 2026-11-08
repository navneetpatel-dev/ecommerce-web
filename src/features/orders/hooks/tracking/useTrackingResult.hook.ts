"use client";

import type { TrackingLookupResult } from "../../api/tracking/shipping.api";
import { formatCodAmountLabel } from "../../utils/tracking/codLabel";

const RESCHEDULABLE_STATUSES = ["FAILED", "RTO_INITIATED"];

export function useTrackingResult(result: TrackingLookupResult) {
  const canReschedule = RESCHEDULABLE_STATUSES.includes(result.status);
  const codLabel =
    result.codAmount != null
      ? formatCodAmountLabel(result.codAmount, result.codCollected)
      : null;

  return { canReschedule, codLabel };
}
