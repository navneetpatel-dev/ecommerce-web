"use client";

import { useCallback, useEffect, useState } from "react";
import { couponsApi } from "@/features/coupons";
import { useAuthStore } from "@/shared/stores/auth.store";
import type { Cart, EligibleCoupon } from "@/shared/api/types";

interface UseEligibleCouponsOptions {
  cart?: Cart | null;
  enabled?: boolean;
}

export function useEligibleCoupons({ cart, enabled = true }: UseEligibleCouponsOptions) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [eligible, setEligible] = useState<EligibleCoupon[]>([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);

  const loadEligible = useCallback(async () => {
    if (!accessToken || !enabled) {
      setEligible([]);
      return [];
    }
    setEligibleLoading(true);
    try {
      const list = await couponsApi.eligible();
      setEligible(list);
      return list;
    } catch {
      setEligible([]);
      return [];
    } finally {
      setEligibleLoading(false);
    }
  }, [accessToken, enabled]);

  // Load eligible offers without auto-applying
  useEffect(() => {
    if (!enabled || !accessToken || !cart?.items?.length) return;
    void loadEligible();
  }, [accessToken, cart?.items?.length, enabled, loadEligible]);

  useEffect(() => {
    if (!cart?.items?.length) {
      setEligible([]);
    }
  }, [cart?.items?.length]);

  return { eligible, eligibleLoading, loadEligible };
}
