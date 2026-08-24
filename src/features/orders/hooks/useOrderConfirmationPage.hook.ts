"use client";

import { useParams } from "next/navigation";

export function useOrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  return { orderId: params?.orderId };
}
