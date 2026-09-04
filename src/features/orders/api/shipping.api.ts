import { apiClient } from "@/shared/api/client";
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
}

export const shippingApi = {
  tracking: (trackingNumber: string) =>
    apiClient.get<TrackingLookupResult>(API.shipping.tracking(trackingNumber)),
  reschedule: (trackingNumber: string, slot: string) =>
    apiClient.post<TrackingLookupResult>(
      API.shipping.reschedule(trackingNumber),
      { slot },
    ),
};
