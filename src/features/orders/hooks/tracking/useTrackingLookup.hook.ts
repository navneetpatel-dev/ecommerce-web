"use client";

import { useEffect, useState } from "react";
import {
  shippingApi,
  type TrackingLookupResult,
} from "../../api/tracking/shipping.api";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

/** How often a still-moving shipment is re-checked while the page is open. */
const TRACKING_REFRESH_INTERVAL_MS = 60_000;

/**
 * Customer-facing settled states. Not the same as the agent's terminal set
 * (FAILED/RTO_INITIATED are still actionable here via reschedule), and nothing
 * more will ever change on the page once one of these is showing.
 */
const SETTLED_STATUSES = new Set(["DELIVERED", "RTO_DELIVERED", "CANCELLED"]);

export function useTrackingLookup() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState<TrackingLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const lookup = async () => {
    setError(null);
    try {
      const data = await shippingApi.tracking(trackingNumber);
      setResult(data);
    } catch (lookupError) {
      setResult(null);
      setError(
        getApiErrorMessage(lookupError, "Could not find that tracking number."),
      );
    }
  };

  const reschedule = async (slot: string) => {
    setIsRescheduling(true);
    setError(null);
    try {
      const data = await shippingApi.reschedule(trackingNumber, slot);
      setResult(data);
    } catch (rescheduleError) {
      setError(
        getApiErrorMessage(rescheduleError, "Could not reschedule delivery."),
      );
    } finally {
      setIsRescheduling(false);
    }
  };

  /**
   * A customer watching an out-for-delivery parcel should not have to re-submit
   * the number to see the next scan, so the lookup refreshes itself until the
   * shipment settles. Refresh failures are swallowed: a dropped request must not
   * replace a good status with an error banner.
   */
  useEffect(() => {
    if (!result || SETTLED_STATUSES.has(result.status)) return;

    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        setResult(await shippingApi.tracking(trackingNumber));
      } catch {
        // Transient (offline, 5xx): keep the last known status on screen.
      }
    };

    const timer = window.setInterval(
      () => void refresh(),
      TRACKING_REFRESH_INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [result, trackingNumber]);

  return {
    trackingNumber,
    setTrackingNumber,
    result,
    error,
    lookup,
    reschedule,
    isRescheduling,
  };
}
