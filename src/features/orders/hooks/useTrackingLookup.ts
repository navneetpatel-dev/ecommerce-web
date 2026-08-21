import { useState } from "react";
import { shippingApi } from "../api/shipping.api";

type TrackingResult = Awaited<ReturnType<typeof shippingApi.tracking>>;

export function useTrackingLookup() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);

  const lookup = async () => {
    const data = await shippingApi.tracking(trackingNumber);
    setResult(data);
  };

  return { trackingNumber, setTrackingNumber, result, lookup };
}
