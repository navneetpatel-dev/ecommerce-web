"use client";

import { useCallback, useEffect, useState } from "react";

export type LocationCaptureStatus =
  "pending" | "success" | "denied" | "unsupported" | "error";

/**
 * Captures a device GPS fix via the browser Geolocation API when the browser
 * allows it. A denied or failed capture does not block saving the address;
 * coordinates are stored only when this succeeds.
 */
export function useCaptureLocation(hasExisting: boolean) {
  const [status, setStatus] = useState<LocationCaptureStatus>(
    hasExisting ? "success" : "pending",
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const capture = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
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

  const retry = useCallback(() => {
    setStatus("pending");
    capture();
  }, [capture]);

  useEffect(() => {
    // Only auto-capture once on mount for a brand-new address; editing an
    // address that already has coordinates keeps them unless the user retries.
    if (!hasExisting) capture();
  }, [hasExisting, capture]);

  // Derived so `capture` itself never setStates synchronously (the mount
  // effect above stays free of set-state-in-effect).
  const unsupported =
    typeof navigator !== "undefined" && !navigator.geolocation;

  return { status: unsupported ? "unsupported" : status, coords, retry };
}
