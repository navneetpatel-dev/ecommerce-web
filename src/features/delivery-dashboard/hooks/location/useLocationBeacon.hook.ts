import { useEffect, useRef } from "react";
import { useUpdateLocation } from "../../api/agent/deliveryAgent.queries";

const BEACON_INTERVAL_MS = 30_000;

export function useLocationBeacon(active: boolean) {
  const updateLocation = useUpdateLocation();
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!active || typeof navigator === "undefined" || !navigator.geolocation)
      return;

    const post = (position: GeolocationPosition) => {
      const now = Date.now();
      if (now - lastSentRef.current < BEACON_INTERVAL_MS) return;
      lastSentRef.current = now;
      updateLocation.mutate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const watchId = navigator.geolocation.watchPosition(post, undefined, {
      enableHighAccuracy: true,
      maximumAge: BEACON_INTERVAL_MS,
    });
    return () => navigator.geolocation.clearWatch(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return { active };
}
