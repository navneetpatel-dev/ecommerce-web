"use client";

import { useMemo } from "react";
import type { Order } from "@/shared/api/types";
import { PATHS } from "@/shared/constants/paths";

interface UseOrderCardParams {
  order: Order;
}

export function useOrderCard({ order }: UseOrderCardParams) {
  const shortId = useMemo(() => {
    return order.id.slice(0, 8);
  }, [order.id]);

  const formattedDate = useMemo(() => {
    return new Date(order.createdAt).toLocaleDateString();
  }, [order.createdAt]);

  const subOrders = useMemo(() => {
    return order.subOrders ?? [];
  }, [order.subOrders]);

  const orderLink = useMemo(() => {
    return PATHS.order(order.id);
  }, [order.id]);

  return {
    shortId,
    formattedDate,
    subOrders,
    orderLink,
  };
}
