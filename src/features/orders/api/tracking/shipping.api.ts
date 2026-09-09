import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export interface TrackingLookupResult {
  status: string;
  lastUpdate: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string | null;
  estimatedDeliveryDate?: string | null;
  failureReason?: string | null;
  failedAttemptCount?: number;
  preferredRedeliverySlot?: string | null;
  codAmount?: number | null;
  codCollected?: boolean;
  proofOfDeliveryUrl?: string | null;
  deliveryAgent?: {
    id: string;
    fullName: string;
    lastLat?: number | null;
    lastLng?: number | null;
    locationUpdatedAt?: string | null;
  } | null;
  /** Delivery address's device-captured GPS fix — null for legacy addresses saved before this existed. */
  destination?: { lat: number; lng: number } | null;
}

export interface DeliveryRating {
  id: string;
  shipmentId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export const shippingApi = {
  tracking: (trackingNumber: string) =>
    apiClient.get<TrackingLookupResult>(API.shipping.tracking(trackingNumber)),
  reschedule: (trackingNumber: string, slot: string) =>
    apiClient.post<TrackingLookupResult>(
      API.shipping.reschedule(trackingNumber),
      { slot },
    ),
  getRating: (shipmentId: string) =>
    apiClient.get<DeliveryRating | null>(API.shipping.rating(shipmentId)),
  submitRating: (shipmentId: string, rating: number, comment?: string) =>
    apiClient.post<DeliveryRating>(API.shipping.rating(shipmentId), {
      rating,
      comment,
    }),
};
