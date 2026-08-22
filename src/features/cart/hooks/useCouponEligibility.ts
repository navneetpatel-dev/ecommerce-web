"use client";

import { useCallback, useEffect, useState } from "react";
import { couponsApi } from "@/features/coupons";
import { useAuthStore } from "@/shared/stores/auth.store";
import type { EligibleCoupon } from "@/shared/api/types";

interface UseCouponEligibilityResult {
  eligible: EligibleCoupon[];
  eligibleLoading: boolean;
  eligibleError: string | null;
  loadEligible: () => Promise<EligibleCoupon[]>;
}

/**
 * Loads the signed-in shopper's eligible coupon offers for the cart
 * (Rule 3: one concern per hook). Errors are surfaced, not swallowed.
 */
export function useCouponEligibility(
  enabled: boolean,
  hasItems: boolean,
): UseCouponEligibilityResult {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [eligible, setEligible] = useState<EligibleCoupon[]>([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);
  const [eligibleError, setEligibleError] = useState<string | null>(null);

  const loadEligible = useCallback(async () => {
    if (!accessToken || !enabled) {
      setEligible([]);
      return [];
    }
    setEligibleLoading(true);
    setEligibleError(null);
    try {
      const list = await couponsApi.eligible();
      setEligible(list);
      return list;
    } catch (error) {
      // Offers are supplementary: keep the cart usable on failure.
      setEligible([]);
      setEligibleError(
        error instanceof Error ? error.message : "Could not load offers",
      );
      return [];
    } finally {
      setEligibleLoading(false);
    }
  }, [accessToken, enabled]);

  // Load eligible offers without auto-applying
  useEffect(() => {
    if (!enabled || !accessToken || !hasItems) return;
    void loadEligible();
  }, [accessToken, hasItems, enabled, loadEligible]);

  useEffect(() => {
    if (!hasItems) {
      setEligible([]);
    }
  }, [hasItems]);

  return { eligible, eligibleLoading, eligibleError, loadEligible };
}
