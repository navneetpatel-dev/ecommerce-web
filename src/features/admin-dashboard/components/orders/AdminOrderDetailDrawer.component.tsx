"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import type { Order } from "@/shared/api/types";

interface AdminOrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
}

export function AdminOrderDetailDrawer({
  order,
  onClose,
}: AdminOrderDetailDrawerProps) {
  if (!order) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const address = order.shippingAddress;
  const items = order.subOrders?.flatMap((sub) => sub.items) ?? [];
  const placedDate = order.createdAt ? formatDateTime(order.createdAt) : "—";

  return (
    <Dialog open={Boolean(order)} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-heading-sm font-semibold text-ink">
              {placedDate}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{order.status}</Badge>
              <Badge variant="secondary">{order.paymentStatus}</Badge>
            </div>
          </div>
          <DialogDescription className="text-body-sm text-ink-muted">
            {LABELS.orderDetails}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Customer & Shipping Section */}
          {address && (
            <div className="rounded-lg border border-line bg-paper/40 p-4">
              <h4 className="text-body-sm font-semibold text-ink">
                {LABELS.addressFormSection}
              </h4>
              <p className="mt-1 text-body-sm font-medium text-ink">
                {address.recipientName ?? "—"}
              </p>
              {address.recipientPhone && (
                <p className="text-body-xs text-ink-muted">
                  {address.recipientPhone}
                </p>
              )}
              <p className="mt-1 text-body-sm text-ink-muted">
                {[
                  address.line1,
                  address.line2,
                  address.city,
                  address.state,
                  address.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}

          {/* Line Items */}
          <div className="space-y-2">
            <h4 className="text-body-sm font-semibold text-ink">
              {LABELS.ordersColumnItems} ({items.length})
            </h4>
            <div className="divide-y divide-line/60 rounded-lg border border-line bg-surface">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3 text-body-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">
                      {item.productName}
                    </p>
                    <p className="text-body-xs text-ink-muted">
                      {LABELS.quantity}: {item.quantity} ×{" "}
                      {formatInr(item.displayUnitPrice ?? item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-semibold text-ink">
                    {formatInr(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Price Breakdown */}
          <div className="rounded-lg border border-line bg-paper/40 p-4">
            <h4 className="text-body-sm font-semibold text-ink">
              {LABELS.paymentSplitHeading}
            </h4>
            <dl className="mt-2 space-y-1.5 text-body-sm">
              <div className="flex justify-between text-ink-muted">
                <dt>{LABELS.subtotal}</dt>
                <dd className="font-medium text-ink">
                  {formatInr(
                    order.itemsTotal ??
                      order.merchandiseSubtotal ??
                      order.totalAmount,
                  )}
                </dd>
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
        </div>

        <DialogFooter className="border-t border-line/60 pt-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {LABELS.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
