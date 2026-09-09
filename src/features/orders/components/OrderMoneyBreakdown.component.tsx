import { LABELS } from "@/shared/constants/labels";
import type { Order } from "@/shared/api/types";
import { taxDisplayLabel } from "@/shared/utils/taxDisplay";
import { formatInr } from "../utils/format";
import { ordersComponentsStyles } from "./ordersComponents.styles";

interface OrderMoneyBreakdownProps {
  order: Pick<
    Order,
    | "totalAmount"
    | "discountTotal"
    | "merchandiseSubtotal"
    | "taxTotal"
    | "shippingTotal"
    | "shippingDisplayKey"
    | "taxDisplayKey"
  >;
  className?: string;
}

export function OrderMoneyBreakdown({
  order,
  className,
}: OrderMoneyBreakdownProps) {
  const merchandiseSubtotal = order.merchandiseSubtotal;
  const taxTotal = order.taxTotal;
  const shippingTotal = order.shippingTotal;
  const showBreakdown =
    merchandiseSubtotal != null || taxTotal != null || shippingTotal != null;

  return (
    <dl className={className ?? ordersComponentsStyles.defaultDl}>
      {showBreakdown && merchandiseSubtotal != null ? (
        <div className={ordersComponentsStyles.row}>
          <dt className={ordersComponentsStyles.label}>{LABELS.subtotal}</dt>
          <dd className={ordersComponentsStyles.value}>
            {formatInr(merchandiseSubtotal)}
          </dd>
        </div>
      ) : null}
      {showBreakdown && order.shippingDisplayKey != null ? (
        <div className={ordersComponentsStyles.row}>
          <dt className={ordersComponentsStyles.label}>Shipping</dt>
          <dd className={ordersComponentsStyles.value}>
            {order.shippingDisplayKey === "FREE"
              ? "Free"
              : shippingTotal != null
                ? formatInr(shippingTotal)
                : "—"}
          </dd>
        </div>
      ) : null}
      {showBreakdown && Number(taxTotal) > 0 ? (
        <div className={ordersComponentsStyles.row}>
          <dt className={ordersComponentsStyles.label}>
            {taxDisplayLabel(order.taxDisplayKey)}
          </dt>
          <dd className={ordersComponentsStyles.value}>
            {formatInr(taxTotal!)}
          </dd>
        </div>
      ) : null}
      {Number(order.discountTotal) > 0 ? (
        <div className={ordersComponentsStyles.rowSuccess}>
          <dt>{LABELS.discount}</dt>
          <dd className={ordersComponentsStyles.valueTabular}>
            −{formatInr(order.discountTotal)}
          </dd>
        </div>
      ) : null}
      <div className={ordersComponentsStyles.rowTotal}>
        <dt className={ordersComponentsStyles.totalLabel}>{LABELS.total}</dt>
        <dd className={ordersComponentsStyles.totalValue}>
          {formatInr(order.totalAmount)}
        </dd>
      </div>
    </dl>
  );
}
