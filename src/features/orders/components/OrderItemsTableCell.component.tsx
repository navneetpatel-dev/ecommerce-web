import { memo } from "react";
import type { Order } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { countOrderItems, orderItemSummary } from "../utils/format";
import { ORDERS_LIST_STYLES } from "./ordersList.styles";

interface OrderItemsTableCellProps {
  order: Order;
}

export const OrderItemsTableCell = memo(function OrderItemsTableCell({
  order,
}: OrderItemsTableCellProps) {
  const itemCount = countOrderItems(order);
  const vendorCount = order.subOrders?.length ?? 0;
  const sellerText =
    vendorCount === 1 ? LABELS.sellerSingular : LABELS.sellerPlural;
  const itemText = itemCount === 1 ? LABELS.itemSingular : LABELS.itemPlural;

  return (
    <div className={ORDERS_LIST_STYLES.itemsCell}>
      <p className={ORDERS_LIST_STYLES.itemsSummary}>
        {orderItemSummary(order)}
      </p>
      <p className={ORDERS_LIST_STYLES.itemsCountText}>
        {vendorCount} {sellerText}
        {" · "}
        {itemCount} {itemText}
      </p>
    </div>
  );
});
