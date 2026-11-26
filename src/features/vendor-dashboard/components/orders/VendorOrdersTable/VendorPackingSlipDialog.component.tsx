"use client";

import { useState } from "react";
import { Package, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "../../../utils/orders/vendorOrderFormat";
import type { OrderItem } from "@/shared/api/types";
import type { VendorSubOrder } from "../../../types/orders/vendorOrders.types";

interface VendorPackingSlipDialogProps {
  subOrder: VendorSubOrder;
}

export function VendorPackingSlipDialog({
  subOrder,
}: VendorPackingSlipDialogProps) {
  const [open, setOpen] = useState(false);
  const items: OrderItem[] = subOrder.items ?? [];
  const itemCount = items.reduce(
    (sum: number, item: OrderItem) => sum + (item.quantity ?? 1),
    0,
  );
  const address = subOrder.shippingAddress;
  const customer = subOrder.customer;
  const refCode = (subOrder.orderReference ?? subOrder.orderId.slice(0, 8))
    .replace(/^#/, "")
    .toUpperCase();

  const primaryItemName = items[0]?.productName ?? "Items";
  const itemSummary =
    items.length > 1
      ? `${primaryItemName} (+${items.length - 1} more)`
      : primaryItemName;

  return (
    <>
      <div className="flex flex-col items-start gap-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-left font-medium text-ink hover:text-amber-500 hover:underline max-w-[200px] truncate cursor-pointer text-body-sm"
          title="Click to view packing slip & delivery address"
        >
          {itemSummary}
        </button>
        <span className="text-[11px] text-ink-muted">
          {itemCount} {itemCount === 1 ? "unit" : "units"}
        </span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <DialogTitle className="text-heading-sm font-semibold text-ink flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                <span>{`Packing Slip • Order #${refCode}`}</span>
              </DialogTitle>
              <Badge variant="outline">{subOrder.status}</Badge>
            </div>
            <DialogDescription className="text-body-sm text-ink-muted">
              {subOrder.taxInvoiceNumber
                ? `Invoice: ${subOrder.taxInvoiceNumber}`
                : "Packing & shipping details"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Delivery Destination */}
            <div className="rounded-lg border border-line bg-paper/40 p-4">
              <div className="flex items-center gap-2 text-body-sm font-semibold text-ink mb-1">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <h4>Delivery Address</h4>
              </div>
              <p className="text-body-sm font-medium text-ink">
                {address?.recipientName ?? customer?.name ?? "Customer"}
              </p>
              {(address?.recipientPhone ?? "") && (
                <p className="text-body-xs text-ink-muted">
                  Phone: {address?.recipientPhone}
                </p>
              )}
              {address ? (
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
              ) : (
                <p className="mt-1 text-body-xs text-ink-muted italic">
                  Address details available upon checkout dispatch sync.
                </p>
              )}
            </div>

            {/* Items to Pack */}
            <div className="space-y-2">
              <h4 className="text-body-sm font-semibold text-ink">
                Items to Pack ({items.length})
              </h4>
              <div className="divide-y divide-line/60 rounded-lg border border-line bg-surface">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3 text-body-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink truncate">
                        {item.productName}
                      </p>
                      {item.variantAttributes &&
                        Object.keys(item.variantAttributes).length > 0 && (
                          <p className="text-[11px] text-ink-muted">
                            {Object.entries(item.variantAttributes)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" • ")}
                          </p>
                        )}
                      <p className="text-body-xs text-ink-muted">
                        Qty: {item.quantity} ×{" "}
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

            {/* Subtotal */}
            <div className="flex justify-between border-t border-line/60 pt-3 text-body-sm font-semibold text-ink">
              <span>Subtotal</span>
              <span>{formatInr(subOrder.subtotal)}</span>
            </div>
          </div>

          <DialogFooter className="border-t border-line/60 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              {LABELS.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
