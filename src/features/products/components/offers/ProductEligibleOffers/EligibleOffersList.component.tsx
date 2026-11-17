import { LABELS } from "@/shared/constants/labels";
import { productEligibleOffersStyles } from "../../../styles/offers/productEligibleOffers.styles";
import {
  EligibleOfferItem,
  type EligibleOffer,
} from "./EligibleOfferItem.component";

interface EligibleOffersListProps {
  offers: EligibleOffer[];
  isScrollable: boolean;
}

export function EligibleOffersList({
  offers,
  isScrollable,
}: EligibleOffersListProps) {
  const ariaLabel = isScrollable
    ? LABELS.availableOffersList
    : LABELS.availableOffers;

  return (
    <ul
      className={productEligibleOffersStyles.list(isScrollable)}
      aria-label={ariaLabel}
      tabIndex={isScrollable ? 0 : undefined}
    >
      {offers.map((offer) => (
        <EligibleOfferItem key={offer.code} offer={offer} />
      ))}
    </ul>
  );
}
