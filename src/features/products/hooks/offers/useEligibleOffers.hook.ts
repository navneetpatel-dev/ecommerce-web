"use client";

import { useQuery } from "@tanstack/react-query";
import { couponsApi } from "@/features/coupons";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import {
  PDP_OFFERS_FETCH_LIMIT,
  PDP_OFFERS_STALE_MS,
} from "../../constants/offers/pdpOffers";

export const eligibleOffersKeys = {
  product: (productId: string, authenticated: boolean) =>
    ["coupons", "eligible", "product", productId, authenticated] as const,
};

/**
 * Owns the PDP eligible-offers query, switching between authenticated and
 * public endpoints based on session state (Rule 1/12).
 */
export function useEligibleOffers(productId: string, enabled: boolean) {
  const accessToken = useAuthStore((s) => s.accessToken);

  const offersQuery = useQuery({
    queryKey: eligibleOffersKeys.product(productId, Boolean(accessToken)),
    queryFn: () =>
      accessToken
        ? couponsApi.eligible({ productId, limit: PDP_OFFERS_FETCH_LIMIT })
        : couponsApi.eligiblePublic({
            productId,
            limit: PDP_OFFERS_FETCH_LIMIT,
          }),
    enabled: Boolean(productId) && enabled,
    staleTime: PDP_OFFERS_STALE_MS,
  });

  return offersQuery;
}
