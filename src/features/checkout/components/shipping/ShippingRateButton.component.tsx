import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingMethod } from "@/shared/constants/statuses";
import type { ShippingRate } from "@/shared/api/types";
import { SHIPPING_CARD_STYLES } from "../../styles/shipping/shippingCard.styles";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

interface ShippingRateButtonProps {
  option: ShippingRate;
  isSelected: boolean;
  onSelect: (method: ShippingMethod) => void;
}

function formatDays(days: number) {
  if (days <= 1) return "1 business day";
  return `${days} business days`;
}

export const ShippingRateButton = memo(function ShippingRateButton({
  option,
  isSelected,
  onSelect,
}: ShippingRateButtonProps) {
  const label =
    option.method === SHIPPING_METHOD.EXPRESS ? "Express" : "Standard";
  const cost =
    option.shippingDisplayKey === "FREE" ? "Free" : formatInr(option.cost);
  const daysText = formatDays(Number(option.estimatedDays || 5));

  const handleClick = () => {
    onSelect(option.method);
  };

  return (
    <Button
      type="button"
      variant="outline"
      aria-pressed={isSelected}
      onClick={handleClick}
      className={SHIPPING_CARD_STYLES.rateButton(isSelected)}
    >
      <div className={SHIPPING_CARD_STYLES.rateButtonContent}>
        <span className={SHIPPING_CARD_STYLES.rateLabel}>{label}</span>
        <span className={SHIPPING_CARD_STYLES.rateCost}>{cost}</span>
      </div>
      <p className={SHIPPING_CARD_STYLES.rateDays}>{daysText}</p>
    </Button>
  );
});
