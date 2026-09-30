"use client";

import { useMemo } from "react";
import type { Order } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "../../utils/detail/format";
import { resolveTaxInvoiceAvailability } from "../../utils/documents/invoiceAvailability.utils";

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

  const invoiceAvailability = useMemo(
    () => resolveTaxInvoiceAvailability(subOrders),
    [subOrders],
  );

  return {
    address,
    subOrders,
    hasMultipleSellers,
    itemCopy,
    formattedTotalAmount,
    invoiceAvailability,
    // A download in flight locks the whole panel, not just the part being fetched.
    allInvoicesDisabled:
      invoicePending || invoiceAvailability.allInvoicesDisabled,
    singleInvoiceDisabled: invoiceAvailability.singleInvoiceDisabled,
  };
}
