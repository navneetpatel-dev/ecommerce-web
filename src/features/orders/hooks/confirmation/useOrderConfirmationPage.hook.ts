"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/features/cart";

export function useOrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();
  // Checkout only marks the cart stale (refetching mid-navigation would flash it), and
  // the header's cart badge stays mounted, so it kept the old count after an online
  // payment. Checkout is gone by now: refetch so the badge shows the emptied cart.
  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: cartKeys.all });
  }, [queryClient]);
  return { orderId: params?.orderId };
}
