"use client";

import { useMemo } from "react";
import { useLiveCashbackOffers } from "../api/cashback.queries";
import {
  bestOfferForCategory,
  cashbackOfferHeadline,
  cashbackOfferTerms,
  offersForCategories,
} from "../utils/cashbackOfferText";

export type CashbackOfferCopy = { id: string; headline: string; terms: string };

/** The badge copy for a product's category, or null when no live offer covers it. */
export function useCashbackOfferBadge(
  categoryId: string | null | undefined,
): CashbackOfferCopy | null {
  const { data: offers } = useLiveCashbackOffers();
  return useMemo(() => {
    const offer = offers ? bestOfferForCategory(offers, categoryId) : null;
    return offer
      ? {
          id: offer.id,
          headline: cashbackOfferHeadline(offer),
          terms: cashbackOfferTerms(offer),
        }
      : null;
  }, [offers, categoryId]);
}

/** Copy for every live offer that covers something in the cart. */
export function useCartCashbackOffers(
  categoryIds: ReadonlyArray<string | null | undefined>,
): CashbackOfferCopy[] {
  const { data: offers } = useLiveCashbackOffers();
  const key = categoryIds.join(",");
  return useMemo(
    () =>
      offers
        ? offersForCategories(offers, key.split(",")).map((offer) => ({
            id: offer.id,
            headline: cashbackOfferHeadline(offer),
            terms: cashbackOfferTerms(offer),
          }))
        : [],
    [offers, key],
  );
}
