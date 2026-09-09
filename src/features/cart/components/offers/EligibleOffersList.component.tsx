import type { UnusedOfferViewModel } from "../coupons/useCartCouponSection.hook";
import { EligibleOfferItem } from "./EligibleOfferItem.component";
import { cartCouponSectionStyles as styles } from "../coupons/cartCouponSection.styles";

interface EligibleOffersListProps {
  offers: UnusedOfferViewModel[];
  compact?: boolean;
  couponPending: boolean;
  onApplyEligible: (code: string) => void;
}

export function EligibleOffersList({
  offers,
  compact,
  couponPending,
  onApplyEligible,
}: EligibleOffersListProps) {
  return (
    <ul className={styles.offersList(compact)}>
      {offers.map((offer) => (
        <EligibleOfferItem
          key={offer.code}
          offer={offer}
          couponPending={couponPending}
          onApplyEligible={onApplyEligible}
        />
      ))}
    </ul>
  );
}
