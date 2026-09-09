import { LABELS } from "@/shared/constants/labels";
import { productEligibleOffersStyles } from "./productEligibleOffers.styles";
import { EligibleOfferItem } from "./EligibleOfferItem.component";

interface Offer {
  code: string;
  discount: number;
  type: string;
}

interface EligibleOffersListProps {
  offers: Offer[];
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
