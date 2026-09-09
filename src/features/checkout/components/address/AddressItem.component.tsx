import { memo } from "react";
import type { Address } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { ADDRESS_STEP_STYLES } from "../../styles/address/addressStep.styles";

interface AddressItemProps {
  address: Address;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const AddressItem = memo(function AddressItem({
  address,
  isSelected,
  onSelect,
}: AddressItemProps) {
  const handleClick = () => onSelect(address.id);

  return (
    <li>
      <Button
        type="button"
        variant="outline"
        aria-pressed={isSelected}
        onClick={handleClick}
        className={ADDRESS_STEP_STYLES.addressButton(isSelected)}
      >
        <div className={ADDRESS_STEP_STYLES.addressContent}>
          <div className={ADDRESS_STEP_STYLES.addressDetails}>
            <p className={ADDRESS_STEP_STYLES.addressLine1}>
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}
            </p>
            <p className={ADDRESS_STEP_STYLES.addressLine2}>
              {address.city}, {address.state} {address.pincode}
            </p>
            <p className={ADDRESS_STEP_STYLES.addressCountry}>
              {address.country}
            </p>
          </div>
          <span
            className={ADDRESS_STEP_STYLES.indicatorRing(isSelected)}
            aria-hidden
          >
            {isSelected && (
              <span className={ADDRESS_STEP_STYLES.indicatorDot} />
            )}
          </span>
        </div>
        {address.isDefault && (
          <span className={ADDRESS_STEP_STYLES.defaultBadge}>
            {LABELS.addressDefault}
          </span>
        )}
      </Button>
    </li>
  );
});
