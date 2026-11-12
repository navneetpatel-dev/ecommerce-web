import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import type { RedeliveryChoice } from "@/shared/utils/orders/redeliveryOptions";

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
}

export const shippingApi = {
  tracking: (trackingNumber: string) =>
    apiClient.get<TrackingLookupResult>(API.shipping.tracking(trackingNumber)),
  /** A day (tomorrow to 14 days ahead) and a window (B-45). */
  reschedule: (trackingNumber: string, choice: RedeliveryChoice) =>
    apiClient.post<TrackingLookupResult>(
      API.shipping.reschedule(trackingNumber),
      choice,
    ),
};
