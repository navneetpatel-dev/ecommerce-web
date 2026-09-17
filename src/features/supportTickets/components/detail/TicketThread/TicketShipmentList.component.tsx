import { LABELS } from "@/shared/constants/labels";
import type { OrderShipmentSummary } from "@/shared/utils/orders/orderShipmentSummary";
import { ticketShipmentSummaryStyles as styles } from "../../../styles/detail/ticketShipmentSummary.styles";
import { TicketShipmentItem } from "./TicketShipmentItem.component";

interface TicketShipmentListProps {
  shipments: OrderShipmentSummary[];
  isLoading: boolean;
  isEmpty: boolean;
}

export function TicketShipmentList({
  shipments,
  isLoading,
  isEmpty,
}: TicketShipmentListProps) {
  if (isLoading) {
    return <p className={styles.loadingText}>{LABELS.loading}</p>;
  }

  if (isEmpty) {
    return <p className={styles.emptyText}>{LABELS.ticketShipmentEmpty}</p>;
  }

  const items = shipments.map((shipment) => (
    <TicketShipmentItem key={shipment.id} shipment={shipment} />
  ));

  return <ul className={styles.list}>{items}</ul>;
}
