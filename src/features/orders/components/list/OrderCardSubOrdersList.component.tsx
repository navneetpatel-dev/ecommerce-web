import { memo } from "react";
import Link from "next/link";
import type { SubOrder } from "@/shared/api/types";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { ORDER_CARD_STYLES } from "../../styles/list/orderCard.styles";

interface OrderCardSubOrdersListProps {
  subOrders: SubOrder[];
  orderLink: string;
}

export const OrderCardSubOrdersList = memo(function OrderCardSubOrdersList({
  subOrders,
  orderLink,
}: OrderCardSubOrdersListProps) {
  if (subOrders.length === 0) return null;

  return (
    <div className={ORDER_CARD_STYLES.subOrdersList}>
      {subOrders.map((so) => (
        <div key={so.id} className={ORDER_CARD_STYLES.subOrderRow}>
          <div className={ORDER_CARD_STYLES.subOrderLeft}>
            <VendorStrip vendor={so.vendor} size="sm" />
            <StatusBadge status={so.status} />
            {so.shipment && <StatusBadge status={so.shipment.status} />}
          </div>
          <Link href={orderLink} className={ORDER_CARD_STYLES.detailsLink}>
            View details
          </Link>
        </div>
      ))}
    </div>
  );
});
