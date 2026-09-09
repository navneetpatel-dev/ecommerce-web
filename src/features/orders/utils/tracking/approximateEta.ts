import { haversineDistanceKm } from "@/shared/utils/geo/geo";

/** Rough urban delivery-bike pace, used only for the "approx." ETA label. */
const ASSUMED_SPEED_KMH = 18;

export function approximateDeliveryEtaText(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): string {
  const km = haversineDistanceKm(origin, destination);
  const minutes = Math.max(1, Math.round((km / ASSUMED_SPEED_KMH) * 60));
  return `~${minutes} min away (${km.toFixed(1)} km, approx.)`;
}
