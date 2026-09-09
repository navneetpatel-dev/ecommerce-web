"use client";

import {
  BankDetailsCard,
  CashDepositsCard,
  EarningsPayoutsCard,
  DeliveryAgentDocumentsCard,
} from "@/features/delivery-dashboard";
import { AvailabilityToggleSection } from "./AvailabilityToggleSection.component";
import { PushNotificationsSection } from "./PushNotificationsSection.component";
import { VehicleHubSection } from "./VehicleHubSection.component";
import { OperatingStatusAside } from "./OperatingStatusAside.component";
import { DeliveryOperationsSkeleton } from "./DeliveryOperationsSkeleton.component";
import { useDeliveryOperationsSection } from "../../../hooks/delivery-operations/useDeliveryOperationsSection.hook";
import { deliveryOperationsSectionStyles as styles } from "../../../styles/delivery-operations/deliveryOperationsSection.styles";

export function DeliveryOperationsSection() {
  const {
    isLoading,
    agent,
    VehicleIcon,
    hasAgent,
    availability,
    push,
    ratingsData,
  } = useDeliveryOperationsSection();

  if (isLoading) {
    return <DeliveryOperationsSkeleton />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.mainControlsColumn}>
          <AvailabilityToggleSection
            availableForAssignment={agent?.availableForAssignment}
            hasAgent={hasAgent}
            availability={availability}
          />

          <DeliveryAgentDocumentsCard />

          <PushNotificationsSection push={push} />

          <VehicleHubSection
            vehicleIcon={VehicleIcon}
            vehicleType={agent?.vehicleType}
            hubOrZone={agent?.hubOrZone}
          />

          <BankDetailsCard bankDetails={agent?.bankDetails} />

          <CashDepositsCard />

          <EarningsPayoutsCard />
        </div>

        <OperatingStatusAside
          vehicleIcon={VehicleIcon}
          agent={agent}
          ratingsData={ratingsData}
        />
      </div>
    </div>
  );
}
