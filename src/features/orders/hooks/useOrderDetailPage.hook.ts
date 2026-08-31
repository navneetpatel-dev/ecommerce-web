"use client";

import { useParams } from "next/navigation";
import { useOrder } from "../api/orders.queries";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";

export function useOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;
  const query = useOrder(orderId ?? "");
  const detail = resolveQueryDetailState(query, { enabled: Boolean(orderId) });

  return {
    order: detail.data,
    isLoading: detail.isLoading,
    notFound: detail.isEmpty,
  };
}
