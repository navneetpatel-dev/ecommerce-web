import type { Order } from "@/shared/api/types";
import { CopyableText } from "@/shared/components/DataTable";
import { shortOrderId } from "../../utils/detail/format";
import { formatInr } from "../../utils/detail/format";
import { ORDERS_LIST_STYLES } from "../../styles/list/ordersList.styles";

interface OrderReferenceCellProps {
  order: Order;
}

/**
 * The order reference (the one in the emails) with the seller's tax invoice number under it
 * once one has been issued; on phones the total sits beside it.
 */
export function OrderReferenceCell({ order }: OrderReferenceCellProps) {
  const reference = `#${shortOrderId(order.id)}`;
  const invoiceNumber = order.subOrders?.[0]?.taxInvoiceNumber;

  return (
    <div className={ORDERS_LIST_STYLES.orderCell}>
      <span className={ORDERS_LIST_STYLES.orderId}>
        <CopyableText value={reference} />
        {invoiceNumber ? (
          <span className={ORDERS_LIST_STYLES.orderInvoice}>
            {invoiceNumber}
          </span>
        ) : null}
      </span>
      <span className={ORDERS_LIST_STYLES.mobileTotal}>
        {formatInr(order.totalAmount)}
      </span>
    </div>
  );
}
