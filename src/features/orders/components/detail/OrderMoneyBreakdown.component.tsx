import { LABELS } from "@/shared/constants/labels";
import type { Order } from "@/shared/api/types";
import { taxDisplayLabel } from "@/shared/utils/formatting/taxDisplay";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "../../utils/detail/format";
import { ordersComponentsStyles } from "../../styles/actions/ordersComponents.styles";

interface OrderMoneyBreakdownProps {
  order: Pick<
    Order,
    | "totalAmount"
    | "discountTotal"
    | "merchandiseSubtotal"
    | "itemsTotal"
    | "couponSavings"
    | "giftWrapFeeAmount"
    | "returnAdjustment"
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
  // The bill as the customer saw it: items with GST, less coupons, plus shipping; the
  // GST inside it is shown, not added. Older payloads fall back to the pre-GST figures.
  const merchandiseSubtotal = order.itemsTotal ?? order.merchandiseSubtotal;
  const discountTotal = order.couponSavings ?? order.discountTotal;
  const taxTotal = order.taxTotal;
  const shippingTotal = order.shippingTotal;
  const showBreakdown =
    merchandiseSubtotal != null || taxTotal != null || shippingTotal != null;

  return (
    <dl className={className ?? ordersComponentsStyles.defaultDl}>
      {showBreakdown && merchandiseSubtotal != null ? (
        <div className={ordersComponentsStyles.row}>
          <dt className={ordersComponentsStyles.label}>
            {LABELS.itemsInclGst}
          </dt>
          <dd className={ordersComponentsStyles.value}>
            {formatInr(merchandiseSubtotal)}
          </dd>
        </div>
      ) : null}
      {Number(discountTotal) > 0 ? (
        <div className={ordersComponentsStyles.rowSuccess}>
          <dt>{LABELS.discount}</dt>
          <dd className={ordersComponentsStyles.valueTabular}>
            −{formatInr(discountTotal)}
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
      {Number(order.giftWrapFeeAmount ?? 0) > 0 ? (
        <div className={ordersComponentsStyles.row}>
          <dt className={ordersComponentsStyles.label}>
            {LABELS.giftWrapFeeLine}
          </dt>
          <dd className={ordersComponentsStyles.value}>
            {formatInr(order.giftWrapFeeAmount)}
          </dd>
        </div>
      ) : null}
      {order.returnAdjustment ? (
        <div className={ordersComponentsStyles.row}>
          <dt className={ordersComponentsStyles.label}>
            {order.returnAdjustment.credit
              ? LABELS.returnShippingRefunded
              : LABELS.returnShippingFeeKept}
          </dt>
          <dd className={ordersComponentsStyles.value}>
            {order.returnAdjustment.credit ? "−" : ""}
            {formatInr(order.returnAdjustment.amount)}
          </dd>
        </div>
      ) : null}
      {showBreakdown && Number(taxTotal) > 0 ? (
        <div className={ordersComponentsStyles.row}>
          <dt className={ordersComponentsStyles.label}>
            {formatLabel(LABELS.includesTax, {
              tax: taxDisplayLabel(order.taxDisplayKey),
            })}
          </dt>
          <dd className={ordersComponentsStyles.value}>
            {formatInr(taxTotal!)}
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
