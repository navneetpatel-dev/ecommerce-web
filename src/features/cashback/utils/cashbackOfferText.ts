import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { CashbackOffer } from "../api/cashback.api";

/** Whether an offer covers a product in this category (`/live` lists sub-categories already). */
export function offerCoversCategory(
  offer: CashbackOffer,
  categoryId: string | null | undefined,
): boolean {
  if (offer.categoryIds.length === 0) return true;
  return Boolean(categoryId && offer.categoryIds.includes(categoryId));
}

/** The highest-percentage live offer for a category, for a single badge. */
export function bestOfferForCategory(
  offers: readonly CashbackOffer[],
  categoryId: string | null | undefined,
): CashbackOffer | null {
  return offers
    .filter((offer) => offerCoversCategory(offer, categoryId))
    .reduce<CashbackOffer | null>(
      (best, offer) => (!best || offer.percent > best.percent ? offer : best),
      null,
    );
}

/** Live offers that cover at least one of these categories (cart: one per offer). */
export function offersForCategories(
  offers: readonly CashbackOffer[],
  categoryIds: ReadonlyArray<string | null | undefined>,
): CashbackOffer[] {
  return offers.filter((offer) =>
    categoryIds.some((id) => offerCoversCategory(offer, id)),
  );
}

/** "5% cashback" — the badge headline. */
export function cashbackOfferHeadline(offer: CashbackOffer): string {
  return formatLabel(LABELS.cashbackBadgePercent, { percent: offer.percent });
}

/** "up to ₹100 · on orders above ₹999 · on online payment" — the server's terms, formatted. */
export function cashbackOfferTerms(offer: CashbackOffer): string {
  const parts: string[] = [];
  if (offer.maxCashback != null) {
    parts.push(
      formatLabel(LABELS.cashbackBadgeUpTo, {
        amount: formatInr(offer.maxCashback),
      }),
    );
  }
  if (offer.minOrderValue > 0) {
    parts.push(
      formatLabel(LABELS.cashbackBadgeAbove, {
        amount: formatInr(offer.minOrderValue),
      }),
    );
  }
  if (offer.paymentMethods.length === 1) {
    parts.push(
      offer.paymentMethods[0] === "COD"
        ? LABELS.cashbackBadgeCod
        : LABELS.cashbackBadgePrepaid,
    );
  }
  return parts.join(" · ");
}
