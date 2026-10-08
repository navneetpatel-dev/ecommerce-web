"use client";

import { useCallback, useEffect, useState } from "react";
import { couponsApi } from "@/features/coupons";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { Cart, EligibleCoupon } from "@/shared/api/types";

interface UseEligibleCouponsOptions {
  cart?: Cart | null;
  enabled?: boolean;
}

export function useEligibleCoupons({
  cart,
  enabled = true,
}: UseEligibleCouponsOptions) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [eligible, setEligible] = useState<EligibleCoupon[]>([]);
  const [eligibleLoading, setEligibleLoading] = useState(true);
  const cartHasItems = Boolean(cart?.items?.length);

  const loadEligible = useCallback((): Promise<EligibleCoupon[]> => {
    if (!accessToken || !enabled) {
      return Promise.resolve([]);
    }
    return couponsApi
      .eligible()
      .then((list) => {
        setEligible(list);
        return list;
      })
      .catch(() => {
        setEligible([]);
        return [] as EligibleCoupon[];
      })
      .finally(() => setEligibleLoading(false));
  }, [accessToken, enabled]);

  // Load eligible offers without auto-applying
  useEffect(() => {
    if (!enabled || !accessToken || !cartHasItems) return;
    void loadEligible();
  }, [accessToken, cartHasItems, enabled, loadEligible]);

  return {
    eligible: cartHasItems ? eligible : [],
    eligibleLoading: enabled && cartHasItems ? eligibleLoading : false,
    loadEligible,
  };
}
