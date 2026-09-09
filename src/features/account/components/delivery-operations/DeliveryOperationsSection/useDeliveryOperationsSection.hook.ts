"use client";

import { Bike, Truck } from "lucide-react";
import {
  useDeliveryProfile,
  useSetAvailability,
  useMyRatingsQuery,
} from "@/features/delivery-dashboard";
import { usePushSubscription } from "@/shared/hooks/usePushSubscription.hook";

export function useDeliveryOperationsSection() {
  const profile = useDeliveryProfile();
  const ratings = useMyRatingsQuery();
  const availability = useSetAvailability();
  const push = usePushSubscription();
  const agent = profile.data;

  const isBike =
    agent?.vehicleType === "BIKE" || agent?.vehicleType === "SCOOTER";
  const VehicleIcon = isBike ? Bike : Truck;
  const hasAgent = Boolean(agent);

  return {
    isLoading: profile.isLoading,
    agent,
    VehicleIcon,
    hasAgent,
    availability,
    push,
    ratingsData: ratings.data,
  };
}
