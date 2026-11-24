import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import type { OrderShipmentSummary } from "@/shared/utils/orders/orderShipmentSummary";
import { adminOrderShipmentActionStyles as styles } from "../../../styles/orders/adminOrderShipmentAction.styles";
import { AdminOrderShipmentItem } from "./AdminOrderShipmentItem.component";

interface AdminOrderShipmentListProps {
  orderId: string;
  shipments: OrderShipmentSummary[];
  isLoading: boolean;
  isEmpty: boolean;
  retryingSubOrderId: string | null;
  onRetryRefund: (subOrderId: string) => void;
}

export function AdminOrderShipmentList({
  orderId,
  shipments,
  isLoading,
  isEmpty,
  retryingSubOrderId,
  onRetryRefund,
}: AdminOrderShipmentListProps) {
  if (isLoading) {
    return (
      <div
        className="space-y-3 py-2"
        data-testid="admin-order-shipments-skeleton"
      >
        <div className="rounded-lg border border-line bg-paper/40 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return <p className={styles.emptyText}>{LABELS.noShipmentsOnOrder}</p>;
  }

  const items = shipments.map((shipment) => (
    <AdminOrderShipmentItem
      key={shipment.id}
      orderId={orderId}
      shipment={shipment}
      isRetrying={retryingSubOrderId === shipment.id}
      onRetryRefund={onRetryRefund}
    />
  ));

  return <ul className={styles.list}>{items}</ul>;
}
