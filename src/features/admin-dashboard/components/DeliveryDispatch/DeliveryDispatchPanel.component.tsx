"use client";

import { Truck } from "lucide-react";
import type { DeliveryAgent } from "@/features/delivery-dashboard";
import { deliveryDispatchPanelStyles } from "./deliveryDispatchPanel.styles";
import { DeliveryDispatchAgentSelect } from "./DeliveryDispatchAgentSelect.component";
import { DeliveryDispatchShipmentList } from "./DeliveryDispatchShipmentList.component";
import { DeliveryDispatchPickupList } from "./DeliveryDispatchPickupList.component";
import { useDeliveryDispatchPanel } from "./useDeliveryDispatchPanel.hook";

export interface DeliveryDispatchPanelProps {
  agents: DeliveryAgent[];
  onDispatched: () => void;
}

export function DeliveryDispatchPanel({
  agents,
  onDispatched,
}: DeliveryDispatchPanelProps) {
  const {
    selectedAgent,
    setSelectedAgent,
    pending,
    message,
    error,
    available,
    run,
  } = useDeliveryDispatchPanel({ agents, onDispatched });

  return (
    <section className={deliveryDispatchPanelStyles.root}>
      <div className={deliveryDispatchPanelStyles.header}>
        <div>
          <div className={deliveryDispatchPanelStyles.titleRow}>
            <Truck
              className={deliveryDispatchPanelStyles.truckIcon}
              aria-hidden="true"
            />
            <h2 className={deliveryDispatchPanelStyles.title}>
              Manual dispatch console
            </h2>
          </div>
          <p className={deliveryDispatchPanelStyles.subtitle}>
            Assign waiting shipments and return pickups to active on-duty
            agents. Grouped by pincode zone.
          </p>
        </div>

        <DeliveryDispatchAgentSelect
          available={available}
          selectedAgent={selectedAgent}
          onSelectedAgentChange={setSelectedAgent}
        />
      </div>

      <div className={deliveryDispatchPanelStyles.grid}>
        <DeliveryDispatchShipmentList
          selectedAgent={selectedAgent}
          pending={pending}
          run={run}
        />
        <DeliveryDispatchPickupList
          selectedAgent={selectedAgent}
          pending={pending}
          run={run}
        />
      </div>

      {message ? (
        <div className={deliveryDispatchPanelStyles.successAlert}>
          {message}
        </div>
      ) : null}
      {error ? (
        <div className={deliveryDispatchPanelStyles.errorAlert}>{error}</div>
      ) : null}
    </section>
  );
}
