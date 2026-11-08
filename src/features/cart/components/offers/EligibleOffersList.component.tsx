"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useExpandableList } from "@/shared/hooks/lists/useExpandableList.hook";
import type { UnusedOfferViewModel } from "../../hooks/coupons/useCartCouponSection.hook";
import { CART_OFFERS_PREVIEW_COUNT } from "../../constants/coupons/cartOffers";
import { EligibleOfferItem } from "./EligibleOfferItem.component";
import { cartCouponSectionStyles as styles } from "../../styles/coupons/cartCouponSection.styles";

interface EligibleOffersListProps {
  offers: UnusedOfferViewModel[];
  compact?: boolean;
  couponPending: boolean;
  onApplyEligible: (code: string) => void;
}

/** Best offers first (the API sorts them); the rest open in place, never in a scroll box. */
export function EligibleOffersList({
  offers,
  compact,
  couponPending,
  onApplyEligible,
}: EligibleOffersListProps) {
  const list = useExpandableList(offers, CART_OFFERS_PREVIEW_COUNT);
  const toggleLabel = list.expanded
    ? LABELS.showLessOffers
    : formatLabel(LABELS.showMoreOffers, { count: list.hiddenCount });

  return (
    <>
      <ul className={styles.offersList(compact)}>
        {list.visibleItems.map((offer) => (
          <EligibleOfferItem
            key={offer.code}
            offer={offer}
            couponPending={couponPending}
            onApplyEligible={onApplyEligible}
          />
        ))}
      </ul>
      {list.canExpand ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className={styles.offersToggle}
          aria-expanded={list.expanded}
          onClick={list.toggleExpanded}
        >
          {toggleLabel}
        </Button>
      ) : null}
    </>
  );
}
