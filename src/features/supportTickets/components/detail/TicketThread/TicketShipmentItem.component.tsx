import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { ProofOfDeliveryThumbnail } from "@/shared/components/ProofOfDeliveryThumbnail";
import { LABELS } from "@/shared/constants/labels";
import type { OrderShipmentSummary } from "@/shared/utils/orders/orderShipmentSummary";
import { ticketShipmentSummaryStyles as styles } from "../../../styles/detail/ticketShipmentSummary.styles";

interface TicketShipmentItemProps {
  shipment: OrderShipmentSummary;
}

export function TicketShipmentItem({ shipment }: TicketShipmentItemProps) {
  const trackingLabel = shipment.trackingNumber
    ? `${LABELS.shipmentTrackingNumber} ${shipment.trackingNumber}`
    : LABELS.notShippedYet;

  return (
    <li className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <p className={styles.vendorName}>
          {shipment.vendorName || LABELS.shipment}
        </p>
        {shipment.status ? <StatusBadge status={shipment.status} /> : null}
      </div>
      <p className={styles.tracking}>{trackingLabel}</p>
      <ProofOfDeliveryThumbnail url={shipment.proofOfDeliveryUrl} compact />
    </li>
  );
}
