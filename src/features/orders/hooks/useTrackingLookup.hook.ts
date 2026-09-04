import { useState } from "react";
import { shippingApi, type TrackingLookupResult } from "../api/shipping.api";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

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
