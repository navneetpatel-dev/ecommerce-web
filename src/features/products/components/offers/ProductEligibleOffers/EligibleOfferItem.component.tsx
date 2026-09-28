import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { productEligibleOffersStyles } from "../../../styles/offers/productEligibleOffers.styles";

interface Offer {
  code: string;
  discount: number;
  type: string;
}

interface EligibleOfferItemProps {
  offer: Offer;
}

function offerDetailLabel(offer: { discount: number; type: string }): string {
  if (offer.discount > 0) {
    return `${formatInr(offer.discount)} ${LABELS.couponDiscount.toLowerCase()}`;
  }
  if (offer.type === "FREE_SHIPPING") return LABELS.couponTypeFreeShipping;
  return LABELS.offersAtCheckout;
}

export function EligibleOfferItem({ offer }: EligibleOfferItemProps) {
  return (
    <li className={productEligibleOffersStyles.offerItem}>
      <span className={productEligibleOffersStyles.offerCode}>
        {offer.code}
      </span>
      <span className={productEligibleOffersStyles.offerDetail}>
        {offerDetailLabel(offer)}
      </span>
    </li>
  );
}
