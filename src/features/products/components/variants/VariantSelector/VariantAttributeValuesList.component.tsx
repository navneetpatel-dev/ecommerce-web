import { variantSelectorStyles } from "./variantSelector.styles";
import { VariantOptionButton } from "./VariantOptionButton.component";

interface VariantAttributeValuesListProps {
  groupKey: string;
  values: string[];
  isAvailable: (key: string, value: string) => boolean;
  isActive: (key: string, value: string) => boolean;
  onSelectValue: (key: string, value: string) => void;
}

export function VariantAttributeValuesList({
  groupKey,
  values,
  isAvailable,
  isActive,
  onSelectValue,
}: VariantAttributeValuesListProps) {
  return (
    <div className={variantSelectorStyles.valuesList}>
      {values.map((value) => (
        <VariantOptionButton
          key={value}
          groupKey={groupKey}
          value={value}
          available={isAvailable(groupKey, value)}
          active={isActive(groupKey, value)}
          onSelectValue={onSelectValue}
        />
      ))}
    </div>
  );
}
