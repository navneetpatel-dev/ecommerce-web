import { LABELS } from "@/shared/constants/labels";
import { CopyTextButton } from "@/shared/components/actions/CopyTextButton.component";
import type { EligibleCoupon } from "@/shared/api/types";
import { offerDetailText, offerDisplayName } from "@/features/coupons";
import { productEligibleOffersStyles as styles } from "../../../styles/offers/productEligibleOffers.styles";

interface EligibleOfferItemProps {
  offer: EligibleCoupon;
}

/** One offer: its name and what it gives, then the actual code to copy. */
export function EligibleOfferItem({ offer }: EligibleOfferItemProps) {
  return (
    <li className={styles.offerItem}>
      <span className={styles.offerText}>
        <span className={styles.offerName}>{offerDisplayName(offer)}</span>
        <span className={styles.offerDetail}>{offerDetailText(offer)}</span>
      </span>
      <span className={styles.offerCodeRow}>
        <span className={styles.offerCode}>{offer.code}</span>
        <CopyTextButton value={offer.code} label={LABELS.copyCouponCode} />
      </span>
    </li>
  );
}
