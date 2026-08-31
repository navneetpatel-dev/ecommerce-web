import { LABELS } from "@/shared/constants/labels";
import type { Order } from "@/shared/api/types";
import { formatInr } from "../utils/format";

interface OrderMoneyBreakdownProps {
  order: Pick<
    Order,
    | "totalAmount"
    | "discountTotal"
    | "merchandiseSubtotal"
    | "taxTotal"
    | "shippingTotal"
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
    merchandiseSubtotal != null ||
    taxTotal != null ||
    shippingTotal != null;

  return (
    <dl className={className ?? "space-y-2.5 text-[0.875rem]"}>
      {showBreakdown && merchandiseSubtotal != null ? (
        <div className="flex items-center justify-between gap-4">
          <dt className="text-ink-muted">{LABELS.subtotal}</dt>
          <dd className="tabular-nums text-ink">
            {formatInr(merchandiseSubtotal)}
          </dd>
        </div>
      ) : null}
      {showBreakdown && Number(shippingTotal) > 0 ? (
        <div className="flex items-center justify-between gap-4">
          <dt className="text-ink-muted">Shipping</dt>
          <dd className="tabular-nums text-ink">{formatInr(shippingTotal!)}</dd>
        </div>
      ) : null}
      {showBreakdown && Number(taxTotal) > 0 ? (
        <div className="flex items-center justify-between gap-4">
          <dt className="text-ink-muted">{LABELS.taxTotal}</dt>
          <dd className="tabular-nums text-ink">{formatInr(taxTotal!)}</dd>
        </div>
      ) : null}
      {Number(order.discountTotal) > 0 ? (
        <div className="flex items-center justify-between gap-4 text-success">
          <dt>{LABELS.discount}</dt>
          <dd className="tabular-nums">−{formatInr(order.discountTotal)}</dd>
        </div>
      ) : null}
      <div className="flex items-end justify-between gap-4 border-t border-line pt-3">
        <dt className="text-body-sm font-semibold uppercase tracking-[0.08em] text-brand">
          {LABELS.total}
        </dt>
        <dd className="font-display text-[1.25rem] leading-none tabular-nums text-brand">
          {formatInr(order.totalAmount)}
        </dd>
      </div>
    </dl>
  );
}
