import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import { formatInr, formatOrderDate } from "@/shared/utils/orderFormat";
import type { Order } from "@/shared/api/types";

interface UserRecentOrdersCardProps {
  orders: Order[];
}

function renderOrderItem(order: Order) {
  const orderShortId = order.id.slice(0, 8).toUpperCase();
  const orderDate = formatOrderDate(order.createdAt);
  const orderTotal = formatInr(order.totalAmount);
  return (
    <li
      key={order.id}
      className="flex flex-wrap items-center justify-between gap-3 py-3 text-body-sm"
    >
      <div className="min-w-0">
        <p className="font-medium text-ink">{orderShortId}</p>
        <p className="text-ink-muted">{orderDate}</p>
      </div>
      <p className="tabular-nums text-ink">{orderTotal}</p>
      <StatusBadge status={order.status} />
    </li>
  );
}

/** Recent-orders card for the admin user detail page. */
export function UserRecentOrdersCard({ orders }: UserRecentOrdersCardProps) {
  const orderItems = orders.map(renderOrderItem);
  const hasOrders = orders.length > 0;
  const ordersSection = hasOrders ? (
    <ul className="divide-y divide-line">{orderItems}</ul>
  ) : (
    <p className="text-body-sm text-ink-muted">
      {adminEntityDetailLabels.noOrdersYet}
    </p>
  );

  return (
    <section className="space-y-3 border border-line bg-surface-raised p-4">
      <h2 className="text-body-sm font-semibold uppercase tracking-wide text-ink-muted">
        {adminEntityDetailLabels.recentOrders}
      </h2>
      {ordersSection}
    </section>
  );
}
