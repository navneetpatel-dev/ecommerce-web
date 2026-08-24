"use client";

import { useParams } from "next/navigation";
import { useOrder } from "../api/orders.queries";

export function useOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const { data: order, isLoading } = useOrder(params?.orderId || "");

  return {
    order,
    isLoading,
    notFound: !isLoading && !order,
  };
}
