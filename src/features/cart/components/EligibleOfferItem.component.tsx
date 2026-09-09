import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { UnusedOfferViewModel } from "./useCartCouponSection.hook";
import { cartCouponSectionStyles as styles } from "./cartCouponSection.styles";

interface EligibleOfferItemProps {
  offer: UnusedOfferViewModel;
  couponPending: boolean;
  onApplyEligible: (code: string) => void;
}

export function EligibleOfferItem({
  offer,
  couponPending,
  onApplyEligible,
}: EligibleOfferItemProps) {
  const handleApply = () => {
    onApplyEligible(offer.code);
  };

  return (
    <li className={styles.offerRow}>
      <span className={styles.offerCode}>
        {offer.code}
        {offer.discountText}
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={styles.offerButton}
        onClick={handleApply}
        disabled={couponPending}
      >
        {LABELS.applyOffer}
      </Button>
    </li>
  );
}
