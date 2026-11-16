"use client";

import { useMemo } from "react";
import type { Order } from "@/shared/api/types";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";

interface UseOrderCardParams {
  order: Order;
}

export function useOrderCard({ order }: UseOrderCardParams) {
  const orderLabel = useMemo(() => {
    return order.subOrders?.[0]?.taxInvoiceNumber ?? LABELS.orderDetails;
  }, [order.subOrders]);

  const formattedDate = useMemo(() => {
    return formatDate(order.createdAt);
  }, [order.createdAt]);

  const subOrders = useMemo(() => {
    return order.subOrders ?? [];
  }, [order.subOrders]);

  const orderLink = useMemo(() => {
    return PATHS.order(order.id);
  }, [order.id]);

  return {
    orderLabel,
    shortId: orderLabel,
    formattedDate,
    subOrders,
    orderLink,
  };
}
