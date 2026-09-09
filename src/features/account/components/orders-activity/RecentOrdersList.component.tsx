import type { RecentOrderViewModel } from "../../hooks/orders-activity/useOrdersActivitySection.hook";
import { RecentOrderCard } from "./RecentOrderCard.component";
import { ordersActivitySectionStyles as styles } from "../../styles/orders-activity/ordersActivitySection.styles";

interface RecentOrdersListProps {
  orders: RecentOrderViewModel[];
}

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  return (
    <ul className={styles.ordersList}>
      {orders.map((order) => (
        <RecentOrderCard key={order.id} order={order} />
      ))}
    </ul>
  );
}
