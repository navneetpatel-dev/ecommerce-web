import type { Order } from "@/shared/api/types";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { useOrderCard } from "./useOrderCard.hook";
import { OrderCardSubOrdersList } from "./OrderCardSubOrdersList.component";
import { ORDER_CARD_STYLES } from "./orderCard.styles";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const { shortId, formattedDate, subOrders, orderLink } = useOrderCard({
    order,
  });

  return (
    <Card>
      <CardHeader className={ORDER_CARD_STYLES.header}>
        <div className={ORDER_CARD_STYLES.headerLeft}>
          <span className={ORDER_CARD_STYLES.orderIdText}>
            Order #{shortId}
          </span>
          <StatusBadge status={order.status} />
          <span className={ORDER_CARD_STYLES.dateText}>{formattedDate}</span>
        </div>
        <span className={ORDER_CARD_STYLES.totalAmount}>
          ₹{order.totalAmount}
        </span>
      </CardHeader>
      <CardContent>
        <OrderCardSubOrdersList subOrders={subOrders} orderLink={orderLink} />
      </CardContent>
    </Card>
  );
}
