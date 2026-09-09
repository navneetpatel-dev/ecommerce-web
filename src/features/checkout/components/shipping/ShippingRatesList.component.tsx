import { memo } from "react";
import type { ShippingMethod } from "@/shared/constants/statuses";
import type { ShippingRate } from "@/shared/api/types";
import { ShippingRateButton } from "./ShippingRateButton.component";
import { SHIPPING_CARD_STYLES } from "./shippingCard.styles";

interface ShippingRatesListProps {
  options: ShippingRate[];
  selected?: string;
  onSelect: (method: ShippingMethod) => void;
}

export const ShippingRatesList = memo(function ShippingRatesList({
  options,
  selected,
  onSelect,
}: ShippingRatesListProps) {
  return (
    <div className={SHIPPING_CARD_STYLES.optionsGrid}>
      {options.map((option) => (
        <ShippingRateButton
          key={option.method}
          option={option}
          isSelected={selected === option.method}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
});
