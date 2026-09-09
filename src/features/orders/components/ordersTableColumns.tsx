import { ChevronRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import type { Order } from "@/shared/api/types";
import type { DataTableColumn } from "@/shared/components/DataTable.component";
import { OrderStatusGroup } from "./OrderStatusGroup.component";
import { OrderItemsTableCell } from "./OrderItemsTableCell.component";
import { formatInr, formatOrderDate, shortOrderId } from "../utils/format";
import { ORDERS_LIST_STYLES } from "./ordersList.styles";

export const ORDER_COLUMNS: DataTableColumn<Order>[] = [
  {
    id: "order",
    header: LABELS.ordersColumnOrder,
    headerClassName: "w-[10%]",
    className: "w-[10%] font-mono text-body-sm",
    truncate: false,
    cell: (order) => `#${shortOrderId(order.id)}`,
  },
  {
    id: "placed",
    header: LABELS.ordersColumnPlaced,
    headerClassName: "w-[12%]",
    className: "w-[12%] text-ink-muted",
    cell: (order) => formatOrderDate(order.createdAt),
  },
  {
    id: "items",
    header: LABELS.ordersColumnItems,
    headerClassName: "w-[38%]",
    className: "w-[38%]",
    truncate: false,
    cell: (order) => <OrderItemsTableCell order={order} />,
  },
  {
    id: "total",
    header: LABELS.ordersColumnTotal,
    headerClassName: "w-[14%] text-right",
    className: "w-[14%] text-right",
    cell: (order) => (
      <span className={ORDERS_LIST_STYLES.totalAmount}>
        {formatInr(order.totalAmount)}
      </span>
    ),
  },
  {
    id: "status",
    header: LABELS.ordersColumnStatus,
    headerClassName: "w-[22%]",
    className: "w-[22%]",
    truncate: false,
    cell: (order) => (
      <OrderStatusGroup
        orderStatus={order.status}
        paymentStatus={order.paymentStatus}
        density="compact"
      />
    ),
  },
  {
    id: "open",
    header: <span className="sr-only">{LABELS.ordersColumnOpen}</span>,
    headerClassName: "w-[4%]",
    className: "w-[4%] text-right",
    hideOnMobile: true,
    truncate: false,
    cell: () => (
      <ChevronRight
        className={ORDERS_LIST_STYLES.openIcon}
        strokeWidth={1.5}
        aria-hidden
      />
    ),
  },
];
