import { variantSelectorStyles } from "./variantSelector.styles";
import { VariantAttributeValuesList } from "./VariantAttributeValuesList.component";

interface VariantAttributeGroupProps {
  groupKey: string;
  values: string[];
  isAvailable: (key: string, value: string) => boolean;
  isActive: (key: string, value: string) => boolean;
  onSelectValue: (key: string, value: string) => void;
}

export function VariantAttributeGroup({
  groupKey,
  values,
  isAvailable,
  isActive,
  onSelectValue,
}: VariantAttributeGroupProps) {
  const selected = values.find((value) => isActive(groupKey, value));

  return (
    <div>
      <div className={variantSelectorStyles.groupHeader}>
        <p className={variantSelectorStyles.groupTitle}>{groupKey}</p>
        {selected ? (
          <p className={variantSelectorStyles.groupSelected}>{selected}</p>
        ) : null}
      </div>
      <VariantAttributeValuesList
        groupKey={groupKey}
        values={values}
        isAvailable={isAvailable}
        isActive={isActive}
        onSelectValue={onSelectValue}
      />
    </div>
  );
}
