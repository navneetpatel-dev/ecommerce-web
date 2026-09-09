"use client";

import { Navigation } from "lucide-react";
import { useLocationBeacon } from "../../hooks/location/useLocationBeacon.hook";
import {
  LOCATION_BEACON_ICON,
  LOCATION_BEACON_TEXT,
} from "../../styles/location/locationBeacon.styles";

/**
 * Posts the agent's live GPS fix while a doorstep task is in progress, so the
 * customer tracking page and admin dispatch view can show where the agent is.
 * Best-effort: silently no-ops without geolocation permission or support.
 */
export function LocationBeacon({ active }: { active: boolean }) {
  useLocationBeacon(active);

  if (!active) return null;

  return (
    <p className={LOCATION_BEACON_TEXT}>
      <Navigation className={LOCATION_BEACON_ICON} aria-hidden="true" />
      Sharing your live location with the customer while this task is open.
    </p>
  );
}
