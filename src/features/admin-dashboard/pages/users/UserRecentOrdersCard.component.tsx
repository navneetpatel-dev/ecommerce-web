import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import { formatInr, formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { Order } from "@/shared/api/types";
import { userRecentOrdersCardStyles } from "./adminUserDetail.styles";

interface UserRecentOrdersCardProps {
  orders: Order[];
}

function renderOrderItem(order: Order) {
  const orderShortId = order.id.slice(0, 8).toUpperCase();
  const orderDate = formatOrderDate(order.createdAt);
  const orderTotal = formatInr(order.totalAmount);
  return (
    <li key={order.id} className={userRecentOrdersCardStyles.orderItem}>
      <div className={userRecentOrdersCardStyles.orderInfo}>
        <p className={userRecentOrdersCardStyles.orderId}>{orderShortId}</p>
        <p className={userRecentOrdersCardStyles.orderDate}>{orderDate}</p>
      </div>
      <p className={userRecentOrdersCardStyles.orderTotal}>{orderTotal}</p>
      <StatusBadge status={order.status} />
    </li>
  );
}

/** Recent-orders card for the admin user detail page. */
export function UserRecentOrdersCard({ orders }: UserRecentOrdersCardProps) {
  const orderItems = orders.map(renderOrderItem);
  const hasOrders = orders.length > 0;
  const ordersSection = hasOrders ? (
    <ul className={userRecentOrdersCardStyles.list}>{orderItems}</ul>
  ) : (
    <p className={userRecentOrdersCardStyles.empty}>
      {adminEntityDetailLabels.noOrdersYet}
    </p>
  );

  return (
    <section className={userRecentOrdersCardStyles.section}>
      <h2 className={userRecentOrdersCardStyles.title}>
        {adminEntityDetailLabels.recentOrders}
      </h2>
      {ordersSection}
    </section>
  );
}
