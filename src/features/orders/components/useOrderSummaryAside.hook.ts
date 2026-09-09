"use client";

import { useMemo } from "react";
import type { Order } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "../utils/format";

interface UseOrderSummaryAsideParams {
  order: Order;
  itemCount: number;
  invoicePending: boolean;
}

export function useOrderSummaryAside({
  order,
  itemCount,
  invoicePending,
}: UseOrderSummaryAsideParams) {
  const address = order.shippingAddress;
  const subOrders = useMemo(() => order.subOrders ?? [], [order.subOrders]);
  const hasMultipleSellers = subOrders.length > 1;

  const itemCopy = useMemo(() => {
    return `${itemCount} ${
      itemCount === 1 ? LABELS.itemSingular : LABELS.itemPlural
    }`;
  }, [itemCount]);

  const formattedTotalAmount = useMemo(() => {
    return formatInr(order.totalAmount);
  }, [order.totalAmount]);

  const allInvoicesDisabled = useMemo(() => {
    return invoicePending || subOrders.every((sub) => !sub.taxInvoiceNumber);
  }, [invoicePending, subOrders]);

  const singleInvoiceDisabled = !subOrders[0]?.taxInvoiceNumber;

  return {
    address,
    subOrders,
    hasMultipleSellers,
    itemCopy,
    formattedTotalAmount,
    allInvoicesDisabled,
    singleInvoiceDisabled,
  };
}
