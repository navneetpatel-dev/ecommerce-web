"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useMyDeliveries,
  useUpdateDeliveryStatus,
} from "../../api/agent/deliveryAgent.queries";
import { groupShipmentsByStop } from "../../utils/deliveries/groupByStop";
import { ACTIVE_DELIVERY_STATUSES } from "../../utils/deliveries/activeStatuses";
import { PATHS } from "@/shared/constants/paths/paths";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

export function useDeliveriesPage() {
  const router = useRouter();
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const query = useMyDeliveries([...ACTIVE_DELIVERY_STATUSES]);
  const updateStatus = useUpdateDeliveryStatus();
  const count = query.data?.length ?? 0;
  const stops = groupShipmentsByStop(query.data ?? []);
  const shipmentCountLabel = `${count} active shipment${count === 1 ? "" : "s"}`;

  const handleScanned = async (text: string) => {
    const match = query.data?.find(
      (shipment) =>
        shipment.trackingNumber.toUpperCase() === text.toUpperCase(),
    );
    if (!match) {
      setScanError(`No assigned delivery matches "${text}".`);
      setScanMessage(null);
      return;
    }
    setScanError(null);
    if (match.status === "PENDING") {
      try {
        await updateStatus.mutateAsync({
          shipmentId: match.id,
          status: "PICKED_UP",
        });
        setScanMessage(`${match.trackingNumber} marked picked up.`);
      } catch (statusError) {
        setScanError(
          getApiErrorMessage(
            statusError,
            "Could not mark this shipment picked up.",
          ),
        );
      }
    }
    router.push(PATHS.delivery.delivery(match.id));
  };

  return {
    query,
    count,
    stops,
    shipmentCountLabel,
    scanError,
    scanMessage,
    handleScanned,
  };
}
