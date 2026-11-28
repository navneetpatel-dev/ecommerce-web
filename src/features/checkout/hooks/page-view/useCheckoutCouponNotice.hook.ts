"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys, useCart } from "@/features/cart";
import { couponsApi } from "@/features/coupons";

/** Coupons on the cart that stopped applying, so checkout can say why and let them go. */
export function useCheckoutCouponNotice() {
  const queryClient = useQueryClient();
  const { data: cart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const removeCoupon = async (code?: string) => {
    if (!code) return;
    setIsRemoving(true);
    try {
      await couponsApi.remove(code);
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    coupons: cart?.inactiveCoupons ?? [],
    isRemoving,
    removeCoupon,
  };
}
