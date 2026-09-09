import { useCallback } from "react";
import type { StaleShipment } from "@/features/delivery-dashboard";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { deliveryForceConfirmLabels } from "@/shared/constants/labels/deliveryForceConfirm";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";
import { staleTasksPanelStyles } from "./staleTasksPanel.styles";

function hoursSince(dateString: string): number {
  return Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (60 * 60 * 1000),
  );
}

interface StaleShipmentRowProps {
  shipment: StaleShipment;
  onForceConfirm: (shipmentId: string, reason: string) => Promise<void>;
}

export function StaleShipmentRow({
  shipment,
  onForceConfirm,
}: StaleShipmentRowProps) {
  const handleConfirm = useCallback(
    async (reason?: string) => {
      await onForceConfirm(shipment.id, reason ?? "");
    },
    [onForceConfirm, shipment.id],
  );

  return (
    <tr className={staleTasksPanelStyles.tableRow}>
      <td className={staleTasksPanelStyles.tableCellMono}>
        {shipment.trackingNumber}
      </td>
      <td className={staleTasksPanelStyles.tableCell}>
        <StatusBadge status={shipment.status} />
      </td>
      <td className={staleTasksPanelStyles.tableCell}>
        {shipment.deliveryAgent?.fullName ?? "—"}
      </td>
      <td className={staleTasksPanelStyles.tableCellWarning}>
        {hoursSince(shipment.updatedAt)}h
      </td>
      <td className={staleTasksPanelStyles.tableCellRight}>
        {shipment.status === "OUT_FOR_DELIVERY" ? (
          <AdminConfirmAction
            inline
            label={deliveryForceConfirmLabels.forceConfirmDelivery}
            title={deliveryForceConfirmLabels.forceConfirmDeliveryTitle}
            description={deliveryForceConfirmLabels.forceConfirmDeliveryBody}
            dialogVariant="warning"
            tone="archive"
            triggerVariant="outline"
            triggerClassName={staleTasksPanelStyles.confirmTrigger}
            requireReason
            reasonLabel={
              deliveryForceConfirmLabels.forceConfirmDeliveryReasonLabel
            }
            reasonHint={
              deliveryForceConfirmLabels.forceConfirmDeliveryReasonHint
            }
            onConfirm={handleConfirm}
          />
        ) : null}
      </td>
    </tr>
  );
}
