import { LABELS } from "@/shared/constants/labels";
import type { OrderShipmentSummary } from "@/shared/utils/orders/orderShipmentSummary";
import { adminOrderShipmentActionStyles as styles } from "../../../styles/orders/adminOrderShipmentAction.styles";
import { AdminOrderShipmentItem } from "./AdminOrderShipmentItem.component";

interface AdminOrderShipmentListProps {
  shipments: OrderShipmentSummary[];
  isLoading: boolean;
  isEmpty: boolean;
  retryingSubOrderId: string | null;
  onRetryRefund: (subOrderId: string) => void;
}

export function AdminOrderShipmentList({
  shipments,
  isLoading,
  isEmpty,
  retryingSubOrderId,
  onRetryRefund,
}: AdminOrderShipmentListProps) {
  if (isLoading) {
    return <p className={styles.loadingText}>{LABELS.loading}</p>;
  }

  if (isEmpty) {
    return <p className={styles.emptyText}>{LABELS.noShipmentsOnOrder}</p>;
  }

  const items = shipments.map((shipment) => (
    <AdminOrderShipmentItem
      key={shipment.id}
      shipment={shipment}
      isRetrying={retryingSubOrderId === shipment.id}
      onRetryRefund={onRetryRefund}
    />
  ));

  return <ul className={styles.list}>{items}</ul>;
}
