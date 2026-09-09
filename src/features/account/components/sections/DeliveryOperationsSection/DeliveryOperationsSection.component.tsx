"use client";

import { Bike, Truck } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  useDeliveryProfile,
  useSetAvailability,
  BankDetailsCard,
  CashDepositsCard,
  EarningsPayoutsCard,
  DeliveryAgentDocumentsCard,
  useMyRatingsQuery,
} from "@/features/delivery-dashboard";
import { usePushSubscription } from "@/shared/hooks/usePushSubscription.hook";
import { AvailabilityToggleSection } from "./AvailabilityToggleSection.component";
import { PushNotificationsSection } from "./PushNotificationsSection.component";
import { VehicleHubSection } from "./VehicleHubSection.component";
import { OperatingStatusAside } from "./OperatingStatusAside.component";

export function DeliveryOperationsSection() {
  const profile = useDeliveryProfile();
  const ratings = useMyRatingsQuery();
  const availability = useSetAvailability();
  const push = usePushSubscription();
  const agent = profile.data;

  if (profile.isLoading) {
    return (
      <div className="space-y-6">
        <div className="border border-line bg-surface p-6 shadow-elevation-1 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="mt-4 h-12 w-full" />
        </div>
      </div>
    );
  }

  const isBike =
    agent?.vehicleType === "BIKE" || agent?.vehicleType === "SCOOTER";
  const VehicleIcon = isBike ? Bike : Truck;
  const hasAgent = Boolean(agent);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]">
        {/* Main Controls Column */}
        <div className="space-y-6">
          <AvailabilityToggleSection
            availableForAssignment={agent?.availableForAssignment}
            hasAgent={hasAgent}
            availability={availability}
          />

          {/* Verification documents (required before going on duty) */}
          <DeliveryAgentDocumentsCard />

          <PushNotificationsSection push={push} />

          <VehicleHubSection
            vehicleIcon={VehicleIcon}
            vehicleType={agent?.vehicleType}
            hubOrZone={agent?.hubOrZone}
          />

          {/* Payout Destination */}
          <BankDetailsCard bankDetails={agent?.bankDetails} />

          {/* Cash deposit reconciliation history */}
          <CashDepositsCard />

          {/* Earnings & Payout History */}
          <EarningsPayoutsCard />
        </div>

        <OperatingStatusAside
          vehicleIcon={VehicleIcon}
          agent={agent}
          ratingsData={ratings.data}
        />
      </div>
    </div>
  );
}
