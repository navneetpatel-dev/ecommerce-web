import { ChevronRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import type { Order } from "@/shared/api/types";
import type { DataTableColumn } from "@/shared/components/DataTable.component";
import { OrderStatusGroup } from "../../components/list/OrderStatusGroup.component";
import { OrderItemsTableCell } from "../../components/list/OrderItemsTableCell.component";
import { formatInr, formatOrderDate, shortOrderId } from "../../utils/detail/format";
import { ORDERS_LIST_STYLES } from "../../styles/list/ordersList.styles";

export const ORDER_COLUMNS: DataTableColumn<Order>[] = [
  {
    id: "order",
    header: LABELS.ordersColumnOrder,
    headerClassName: ORDERS_LIST_STYLES.colOrderHeader,
    className: ORDERS_LIST_STYLES.colOrderCell,
    truncate: false,
    cell: (order) => (
      <div className={ORDERS_LIST_STYLES.orderCell}>
        <span className={ORDERS_LIST_STYLES.orderId}>
          #{shortOrderId(order.id)}
        </span>
        <span className={ORDERS_LIST_STYLES.mobileTotal}>
          {formatInr(order.totalAmount)}
        </span>
      </div>
    ),
  },
  {
    id: "placed",
    header: LABELS.ordersColumnPlaced,
    headerClassName: ORDERS_LIST_STYLES.colPlacedHeader,
    className: ORDERS_LIST_STYLES.colPlacedCell,
    cell: (order) => formatOrderDate(order.createdAt),
  },
  {
    id: "items",
    header: LABELS.ordersColumnItems,
    headerClassName: ORDERS_LIST_STYLES.colItemsHeader,
    className: ORDERS_LIST_STYLES.colItemsCell,
    truncate: false,
    cell: (order) => <OrderItemsTableCell order={order} />,
  },
  {
    id: "total",
    header: LABELS.ordersColumnTotal,
    headerClassName: ORDERS_LIST_STYLES.colTotalHeader,
    className: ORDERS_LIST_STYLES.colTotalCell,
    hideOnMobile: true,
    cell: (order) => (
      <span className={ORDERS_LIST_STYLES.totalAmount}>
        {formatInr(order.totalAmount)}
      </span>
    ),
  },
  {
    id: "status",
    header: LABELS.ordersColumnStatus,
    headerClassName: ORDERS_LIST_STYLES.colStatusHeader,
    className: ORDERS_LIST_STYLES.colStatusCell,
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
    header: (
      <span className={ORDERS_LIST_STYLES.srOnly}>
        {LABELS.ordersColumnOpen}
      </span>
    ),
    headerClassName: ORDERS_LIST_STYLES.colOpenHeader,
    className: ORDERS_LIST_STYLES.colOpenCell,
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
