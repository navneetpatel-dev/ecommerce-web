import Link from "next/link";
import type { RecentOrderViewModel } from "./useOrdersActivitySection.hook";
import { ordersActivitySectionStyles as styles } from "./ordersActivitySection.styles";

interface RecentOrderCardProps {
  order: RecentOrderViewModel;
}

export function RecentOrderCard({ order }: RecentOrderCardProps) {
  return (
    <li>
      <Link href={order.href} className={styles.orderRow}>
        <div className={styles.orderInfo}>
          <p className={styles.orderId}>{order.shortId}</p>
          <p className={styles.orderSummary}>{order.summary}</p>
          <p className={styles.orderDate}>{order.date}</p>
        </div>
        <p className={styles.orderAmount}>{order.formattedAmount}</p>
      </Link>
    </li>
  );
}
