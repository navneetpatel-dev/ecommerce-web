import { LABELS } from "@/shared/constants/labels";
import type { EligibleCoupon } from "@/shared/api/types";
import { productEligibleOffersStyles } from "../../../styles/offers/productEligibleOffers.styles";
import { EligibleOfferItem } from "./EligibleOfferItem.component";

interface EligibleOffersListProps {
  offers: EligibleCoupon[];
}

export function EligibleOffersList({ offers }: EligibleOffersListProps) {
  return (
    <ul
      className={productEligibleOffersStyles.list}
      aria-label={LABELS.availableOffers}
    >
      {offers.map((offer) => (
        <EligibleOfferItem key={offer.code} offer={offer} />
      ))}
    </ul>
  );
}
