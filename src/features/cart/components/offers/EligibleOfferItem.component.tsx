import { Button } from "@/shared/components/ui/button";
import type { UnusedOfferViewModel } from "../../hooks/coupons/useCartCouponSection.hook";
import { cartCouponSectionStyles as styles } from "../../styles/coupons/cartCouponSection.styles";

interface EligibleOfferItemProps {
  offer: UnusedOfferViewModel;
  couponPending: boolean;
  onApplyEligible: (code: string) => void;
}

/** One offer: its name (wrapping, never cut), what it gives and its code, then the button. */
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
      <span className={styles.offerText}>
        <span className={styles.offerName}>{offer.label}</span>
        <span className={styles.offerDetail}>
          {offer.detailText}
          <span className={styles.offerCode}>{offer.code}</span>
        </span>
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={styles.offerButton}
        onClick={handleApply}
        disabled={couponPending || offer.locked}
      >
        {offer.actionLabel}
      </Button>
    </li>
  );
}
