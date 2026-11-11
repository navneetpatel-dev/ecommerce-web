import { variantSelectorStyles } from "../../../styles/variants/variantSelector.styles";
import { VariantOptionButton } from "./VariantOptionButton.component";

interface VariantAttributeValuesListProps {
  groupKey: string;
  values: string[];
  isAvailable: (key: string, value: string) => boolean;
  changesOtherChoices?: (key: string, value: string) => string[];
  isActive: (key: string, value: string) => boolean;
  onSelectValue: (key: string, value: string) => void;
}

export function VariantAttributeValuesList({
  groupKey,
  values,
  isAvailable,
  changesOtherChoices,
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
          changedGroups={changesOtherChoices?.(groupKey, value) ?? []}
          active={isActive(groupKey, value)}
          onSelectValue={onSelectValue}
        />
      ))}
    </div>
  );
}
