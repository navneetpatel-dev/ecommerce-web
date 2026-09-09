"use client";

import { useCallback, useEffect, useState } from "react";

export type LocationCaptureStatus =
  "pending" | "success" | "denied" | "unsupported" | "error";

/**
 * Captures a device GPS fix via the browser Geolocation API. Addresses are
 * required to have a real lat/lng before they can be saved (see
 * address.schema.ts `addressFieldChecks`) — this is the capture mechanism
 * behind that requirement, not a geocode of the typed address.
 */
export function useCaptureLocation(hasExisting: boolean) {
  const [status, setStatus] = useState<LocationCaptureStatus>(
    hasExisting ? "success" : "pending",
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const capture = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("pending");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("success");
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, []);

  useEffect(() => {
    if (!hasExisting) capture();
    // Only auto-capture once on mount for a brand-new address; editing an
    // address that already has coordinates keeps them unless the user retries.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, coords, retry: capture };
}
