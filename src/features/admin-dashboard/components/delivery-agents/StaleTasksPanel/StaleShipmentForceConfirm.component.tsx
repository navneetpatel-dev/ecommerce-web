import type { StaleShipment } from "@/features/delivery-dashboard";
import { deliveryForceConfirmLabels as labels } from "@/shared/constants/labels/deliveryForceConfirm";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";
import {
  useStaleShipmentForceConfirm,
  type ForceConfirmFn,
} from "../../../hooks/delivery-agents/useStaleShipmentForceConfirm.hook";
import { staleTasksPanelStyles as styles } from "../../../styles/delivery-agents/staleTasksPanel.styles";

interface StaleShipmentForceConfirmProps {
  shipment: StaleShipment;
  onForceConfirm: ForceConfirmFn;
}

/**
 * Admin override for a delivery stuck out for delivery. For a COD parcel the admin
 * states whether the cash was collected; it is never assumed.
 */
export function StaleShipmentForceConfirm({
  shipment,
  onForceConfirm,
}: StaleShipmentForceConfirmProps) {
  const { isCod, confirmWithoutCash, confirmCashCollected } =
    useStaleShipmentForceConfirm(shipment, onForceConfirm);

  return (
    <>
      {isCod ? (
        <AdminConfirmAction
          inline
          label={labels.forceConfirmCodCollected}
          title={labels.forceConfirmDeliveryTitle}
          description={labels.forceConfirmCodCollectedBody}
          dialogVariant="warning"
          tone="archive"
          triggerVariant="outline"
          triggerClassName={styles.confirmTrigger}
          requireReason
          reasonLabel={labels.forceConfirmDeliveryReasonLabel}
          reasonHint={labels.forceConfirmDeliveryReasonHint}
          onConfirm={confirmCashCollected}
        />
      ) : null}
      <AdminConfirmAction
        inline
        label={
          isCod
            ? labels.forceConfirmCodNotCollected
            : labels.forceConfirmDelivery
        }
        title={labels.forceConfirmDeliveryTitle}
        description={
          isCod
            ? labels.forceConfirmCodNotCollectedBody
            : labels.forceConfirmDeliveryBody
        }
        dialogVariant="warning"
        tone="archive"
        triggerVariant="outline"
        triggerClassName={styles.confirmTrigger}
        requireReason
        reasonLabel={labels.forceConfirmDeliveryReasonLabel}
        reasonHint={labels.forceConfirmDeliveryReasonHint}
        onConfirm={confirmWithoutCash}
      />
    </>
  );
}
