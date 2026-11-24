"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { Order } from "@/shared/api/types";

interface AdminOrderPriceSummaryProps {
  order: Order;
}

export function AdminOrderPriceSummary({ order }: AdminOrderPriceSummaryProps) {
  const subtotal =
    order.itemsTotal ?? order.merchandiseSubtotal ?? order.totalAmount;

  return (
    <div className="rounded-lg border border-line bg-paper/40 p-4">
      <h4 className="text-body-sm font-semibold text-ink">
        {LABELS.paymentSplitHeading}
      </h4>
      <dl className="mt-2 space-y-1.5 text-body-sm">
        <div className="flex justify-between text-ink-muted">
          <dt>{LABELS.subtotal}</dt>
          <dd className="font-medium text-ink">{formatInr(subtotal)}</dd>
        </div>
        {order.couponSavings ? (
          <div className="flex justify-between text-ink-muted">
            <dt>{LABELS.couponDiscount}</dt>
            <dd className="font-medium text-emerald-600">
              -{formatInr(order.couponSavings)}
            </dd>
          </div>
        ) : null}
        {order.shippingTotal != null && (
          <div className="flex justify-between text-ink-muted">
            <dt>{LABELS.shipping}</dt>
            <dd className="font-medium text-ink">
              {order.shippingTotal === 0
                ? LABELS.freeShipping
                : formatInr(order.shippingTotal)}
            </dd>
          </div>
        )}
        {order.taxTotal != null && (
          <div className="flex justify-between text-ink-muted">
            <dt>{LABELS.taxIgst}</dt>
            <dd className="font-medium text-ink">
              {formatInr(order.taxTotal)}
            </dd>
          </div>
        )}
        <div className="flex justify-between border-t border-line/60 pt-2 text-body-base font-semibold text-ink">
          <dt>{LABELS.total}</dt>
          <dd>{formatInr(order.totalAmount)}</dd>
        </div>
      </dl>
      {order.paymentMethod && (
        <p className="mt-2 border-t border-line/40 pt-2 text-body-xs text-ink-muted">
          {LABELS.paymentMethod}: {order.paymentMethod}
        </p>
      )}
    </div>
  );
}
