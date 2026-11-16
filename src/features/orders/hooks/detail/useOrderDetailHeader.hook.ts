"use client";

import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Order } from "@/shared/api/types";
import { formatOrderDate } from "../../utils/detail/format";

interface UseOrderDetailHeaderParams {
  order: Order;
  itemCount: number;
  vendorCount: number;
}

export function useOrderDetailHeader({
  order,
  itemCount,
  vendorCount,
}: UseOrderDetailHeaderParams) {
  const placedCopy = useMemo(() => {
    return formatLabel(LABELS.placedOn, {
      date: formatOrderDate(order.createdAt),
    });
  }, [order.createdAt]);

  const orderLabel = useMemo(() => {
    return order.subOrders?.[0]?.taxInvoiceNumber ?? LABELS.orderDetails;
  }, [order.subOrders]);

  const metaText = useMemo(() => {
    if (vendorCount <= 0) return placedCopy;
    const sellerText =
      vendorCount === 1 ? LABELS.sellerSingular : LABELS.sellerPlural;
    const itemText = itemCount === 1 ? LABELS.itemSingular : LABELS.itemPlural;
    return `${placedCopy} · ${vendorCount} ${sellerText} · ${itemCount} ${itemText}`;
  }, [placedCopy, vendorCount, itemCount]);

  return {
    orderLabel,
    orderIdShort: orderLabel,
    metaText,
  };
}
