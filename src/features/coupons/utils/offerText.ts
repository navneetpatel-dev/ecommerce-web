import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { EligibleCoupon } from "@/shared/api/types";

type OfferForText = Pick<
  EligibleCoupon,
  | "code"
  | "name"
  | "type"
  | "discount"
  | "cashbackAmount"
  | "missingCount"
  | "sellerName"
>;

/** "Free shipping · TechWorld" for a vendor's offer, so it can't look like the platform's. */
export function offerDisplayName(offer: OfferForText): string {
  const name = offer.name || offer.code;
  return offer.sellerName
    ? formatLabel(LABELS.offerFromSeller, { name, seller: offer.sellerName })
    : name;
}

/**
 * What the offer gives, in words, from the amounts the API worked out (display only):
 * an unfinished bundle says what's missing; cashback says it comes after delivery.
 */
export function offerDetailText(offer: OfferForText): string {
  if (offer.missingCount) {
    return formatLabel(LABELS.bundleUnlock, {
      count: offer.missingCount,
      amount: formatInr(offer.discount),
    });
  }
  if (offer.discount > 0) {
    return formatLabel(LABELS.offerSaving, {
      amount: formatInr(offer.discount),
    });
  }
  if ((offer.cashbackAmount ?? 0) > 0) {
    return formatLabel(LABELS.offerCashbackAfterDelivery, {
      amount: formatInr(offer.cashbackAmount),
    });
  }
  if (offer.type === "FREE_SHIPPING") return LABELS.couponTypeFreeShipping;
  return LABELS.offersAtCheckout;
}
