"use client";

import {
  useMyDeliveries,
  useMyPickups,
  useShiftSummary,
} from "../../api/agent/deliveryAgent.queries";
import {
  ACTIVE_DELIVERY_STATUSES,
  SCHEDULED_PICKUP_STATUSES,
} from "../../utils/deliveries/activeStatuses";

export function useTodayPage() {
  const deliveries = useMyDeliveries([...ACTIVE_DELIVERY_STATUSES]);
  const pickups = useMyPickups([...SCHEDULED_PICKUP_STATUSES]);
  const shiftSummary = useShiftSummary();
  const deliveryCount = deliveries.data?.length ?? 0;
  const pickupCount = pickups.data?.length ?? 0;
  const count = deliveryCount + pickupCount;
  const taskCountLabel = `${count} active task${count === 1 ? "" : "s"} in your current assignment queue.`;

  return {
    deliveries,
    pickups,
    shiftSummary,
    deliveryCount,
    pickupCount,
    taskCountLabel,
    hasQueryError: deliveries.isError || pickups.isError,
    queryError: deliveries.error ?? pickups.error,
  };
}
