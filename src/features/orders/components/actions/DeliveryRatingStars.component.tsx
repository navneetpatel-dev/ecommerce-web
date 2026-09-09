import { Star } from "lucide-react";
import {
  DELIVERY_RATING_STAR_VALUES,
  deliveryRatingStarLabel,
} from "../../constants/actions/deliveryRating";
import { ordersComponentsStyles } from "../../styles/actions/ordersComponents.styles";

interface DeliveryRatingStarsProps {
  selected: number;
  onSelect: (value: number) => void;
}

export function DeliveryRatingStars({
  selected,
  onSelect,
}: DeliveryRatingStarsProps) {
  return (
    <div className={ordersComponentsStyles.promptStarsRow}>
      {DELIVERY_RATING_STAR_VALUES.map((value) => (
        <button
          key={value}
          type="button"
          aria-label={deliveryRatingStarLabel(value)}
          onClick={() => onSelect(value)}
        >
          <Star
            className={
              value <= selected
                ? ordersComponentsStyles.starSelected
                : ordersComponentsStyles.starUnselected
            }
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
