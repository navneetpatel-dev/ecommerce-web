"use client";

import { useEffect, useRef } from "react";
import { Navigation } from "lucide-react";
import { useUpdateLocation } from "../api/deliveryAgent.queries";

const BEACON_INTERVAL_MS = 30_000;

/**
 * Posts the agent's live GPS fix while a doorstep task is in progress, so the
 * customer tracking page and admin dispatch view can show where the agent is.
 * Best-effort: silently no-ops without geolocation permission or support.
 */
export function LocationBeacon({ active }: { active: boolean }) {
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

  if (!active) return null;

  return (
    <p className="flex items-center gap-1.5 text-caption text-ink-muted">
      <Navigation className="size-3.5" aria-hidden="true" />
      Sharing your live location with the customer while this task is open.
    </p>
  );
}
