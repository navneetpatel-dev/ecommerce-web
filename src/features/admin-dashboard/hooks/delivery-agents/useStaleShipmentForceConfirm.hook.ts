import { useCallback } from "react";
import type { StaleShipment } from "@/features/delivery-dashboard";

export type ForceConfirmFn = (
  shipmentId: string,
  reason: string,
  codCollected?: boolean,
) => Promise<void>;

/** Force-confirm handlers for a stuck shipment; a COD one says whether cash was taken. */
export function useStaleShipmentForceConfirm(
  shipment: StaleShipment,
  onForceConfirm: ForceConfirmFn,
) {
  const isCod = shipment.codAmount != null;
  const confirmWithoutCash = useCallback(
    async (reason?: string) => {
      await onForceConfirm(shipment.id, reason ?? "", false);
    },
    [onForceConfirm, shipment.id],
  );
  const confirmCashCollected = useCallback(
    async (reason?: string) => {
      await onForceConfirm(shipment.id, reason ?? "", true);
    },
    [onForceConfirm, shipment.id],
  );
  return { isCod, confirmWithoutCash, confirmCashCollected };
}
