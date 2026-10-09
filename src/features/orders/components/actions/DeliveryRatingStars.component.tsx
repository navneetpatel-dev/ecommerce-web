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
  const selectStar = (value: number) => () => onSelect(value);

  return (
    <div className={ordersComponentsStyles.promptStarsRow}>
      {DELIVERY_RATING_STAR_VALUES.map((value) => (
        <button
          key={value}
          type="button"
          aria-label={deliveryRatingStarLabel(value)}
          className={ordersComponentsStyles.promptStarButton}
          onClick={selectStar(value)}
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
