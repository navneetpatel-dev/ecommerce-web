"use client";

import { useCallback, useEffect, useState } from "react";
import { couponsApi } from "@/features/coupons";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
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
  const [eligibleLoading, setEligibleLoading] = useState(true);
  const [eligibleError, setEligibleError] = useState<string | null>(null);

  const loadEligible = useCallback((): Promise<EligibleCoupon[]> => {
    if (!accessToken || !enabled) {
      return Promise.resolve([]);
    }
    return couponsApi
      .eligible()
      .then((list) => {
        setEligible(list);
        setEligibleError(null);
        return list;
      })
      .catch((error) => {
        // Offers are supplementary: keep the cart usable on failure.
        setEligible([]);
        setEligibleError(getApiErrorMessage(error, LABELS.couldNotLoadOptions));
        return [] as EligibleCoupon[];
      })
      .finally(() => setEligibleLoading(false));
  }, [accessToken, enabled]);

  // Load eligible offers without auto-applying
  useEffect(() => {
    if (!enabled || !accessToken || !hasItems) return;
    void loadEligible();
  }, [accessToken, hasItems, enabled, loadEligible]);

  return {
    eligible: hasItems ? eligible : [],
    eligibleLoading: enabled && hasItems ? eligibleLoading : false,
    eligibleError,
    loadEligible,
  };
}
