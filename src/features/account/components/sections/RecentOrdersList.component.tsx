import type { RecentOrderViewModel } from "./useOrdersActivitySection.hook";
import { RecentOrderCard } from "./RecentOrderCard.component";
import { ordersActivitySectionStyles as styles } from "./ordersActivitySection.styles";

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
