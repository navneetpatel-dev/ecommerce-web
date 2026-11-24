import { Skeleton } from "@/shared/components/ui/skeleton";
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
    return (
      <div className="space-y-2 py-1" data-testid="ticket-shipments-skeleton">
        <Skeleton className="h-14 w-full rounded-md" />
      </div>
    );
  }

  if (isEmpty) {
    return <p className={styles.emptyText}>{LABELS.ticketShipmentEmpty}</p>;
  }

  const items = shipments.map((shipment) => (
    <TicketShipmentItem key={shipment.id} shipment={shipment} />
  ));

  return <ul className={styles.list}>{items}</ul>;
}
