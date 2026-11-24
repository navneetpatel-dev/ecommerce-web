"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
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
import { formatInr, shortOrderId } from "@/shared/utils/formatting/orderFormat";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import { ordersApi, ordersKeys } from "@/features/orders";
import type { Order } from "@/shared/api/types";
import { AdminOrderPriceSummary } from "./AdminOrderPriceSummary.component";

interface AdminOrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
}

export function AdminOrderDetailDrawer({
  order,
  onClose,
}: AdminOrderDetailDrawerProps) {
  const detailQuery = useQuery({
    queryKey: ordersKeys.detail(order?.id ?? ""),
    queryFn: () => ordersApi.detail(order!.id),
    enabled: Boolean(order?.id),
  });

  if (!order) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const active = detailQuery.data ?? order;
  const address = active.shippingAddress;
  const subOrders = active.subOrders ?? [];
  const placedDate = active.createdAt ? formatDateTime(active.createdAt) : "—";
  const refCode = active.orderReference ?? shortOrderId(active.id);
  const customerLabel = active.customerName ? ` • ${active.customerName}` : "";

  return (
    <Dialog open={Boolean(order)} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-heading-sm font-semibold text-ink">
              {`Order #${refCode}${customerLabel}`}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{active.status}</Badge>
              <Badge variant="secondary">{active.paymentStatus}</Badge>
            </div>
          </div>
          <DialogDescription className="text-body-sm text-ink-muted">
            {placedDate} • {LABELS.orderDetails}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
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

          <div className="space-y-3">
            <h4 className="text-body-sm font-semibold text-ink">
              {LABELS.ordersColumnItems}
            </h4>
            {subOrders.map((sub) => (
              <div
                key={sub.id}
                className="rounded-lg border border-line bg-surface p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-body-xs font-medium text-ink-muted border-b border-line/50 pb-1.5">
                  <span>{sub.vendor?.businessName ?? "Vendor"}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {sub.status}
                  </Badge>
                </div>
                <div className="divide-y divide-line/40">
                  {sub.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-2 text-body-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {item.imageUrl && (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-line bg-paper">
                            <Image
                              src={item.imageUrl}
                              alt={item.productName}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-ink">
                            {item.productName}
                          </p>
                          <p className="text-body-xs text-ink-muted">
                            {LABELS.quantity}: {item.quantity} ×{" "}
                            {formatInr(item.displayUnitPrice ?? item.unitPrice)}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-ink shrink-0">
                        {formatInr(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <AdminOrderPriceSummary order={active} />
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
