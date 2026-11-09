"use client";

import { LABELS } from "@/shared/constants/labels";
import { useCartCashbackOffers } from "../hooks/useCashbackOfferBadge.hook";
import { cashbackOfferBadgeStyles as styles } from "../styles/cashbackOfferBadge.styles";
import { CashbackOfferDetailList } from "./CashbackOfferDetailList.component";

interface CartCashbackOffersProps {
  categoryIds: ReadonlyArray<string | null | undefined>;
}

/** Live cashback offers covering the cart; the exact amount shows at checkout. */
export function CartCashbackOffers({ categoryIds }: CartCashbackOffersProps) {
  const offers = useCartCashbackOffers(categoryIds);
  if (offers.length === 0) return null;
  return (
    <section
      className={styles.section}
      aria-label={LABELS.cashbackCartOffersTitle}
    >
      <p className={styles.listTitle}>{LABELS.cashbackCartOffersTitle}</p>
      <CashbackOfferDetailList offers={offers} />
    </section>
  );
}
