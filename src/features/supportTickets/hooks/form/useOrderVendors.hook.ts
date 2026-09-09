"use client";

import { useEffect, useState } from "react";
import {
  SUPPORT_TICKET_CATEGORY,
  type SupportTicketCategory,
} from "@/shared/constants/statuses";
import { ordersApi } from "@/features/orders";
import { collectOrderVendors } from "../../utils/form/utils";
import type { OrderVendorOption } from "../../types/form/types";

export function useOrderVendors(
  relatedOrderId: string,
  category: SupportTicketCategory,
  hasOrder: boolean,
  setRelatedVendorId: React.Dispatch<React.SetStateAction<string>>,
): OrderVendorOption[] {
  const [orderVendors, setOrderVendors] = useState<OrderVendorOption[]>([]);

  useEffect(() => {
    let cancelled = false;

    if (!relatedOrderId.trim()) {
      queueMicrotask(() => setOrderVendors([]));
      return;
    }

    void (async () => {
      try {
        const order = await ordersApi.detail(relatedOrderId.trim());
        if (cancelled) return;
        const vendors = collectOrderVendors(order.subOrders ?? []);
        setOrderVendors(vendors);
        if (vendors.length === 0) {
          setRelatedVendorId("");
        } else if (vendors.length === 1) {
          setRelatedVendorId(vendors[0]!.id);
        } else {
          setRelatedVendorId((prev) =>
            vendors.some((vendor) => vendor.id === prev) ? prev : "",
          );
        }
      } catch {
        if (cancelled) return;
        setOrderVendors([]);
        setRelatedVendorId("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [relatedOrderId, setRelatedVendorId]);

  useEffect(() => {
    if (!hasOrder && category !== SUPPORT_TICKET_CATEGORY.VENDOR) {
      queueMicrotask(() => setRelatedVendorId(""));
    }
  }, [category, hasOrder, setRelatedVendorId]);

  return orderVendors;
}
