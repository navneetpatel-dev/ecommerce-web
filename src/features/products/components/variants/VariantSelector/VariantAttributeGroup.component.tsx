import { variantSelectorStyles } from "../../../styles/variants/variantSelector.styles";
import { VariantAttributeValuesList } from "./VariantAttributeValuesList.component";
import { useVariantAttributeGroup } from "../../../hooks/variants/useVariantAttributeGroup.hook";

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
  const { titleId, selected } = useVariantAttributeGroup(
    groupKey,
    values,
    isActive,
  );

  return (
    <div role="radiogroup" aria-labelledby={titleId}>
      <div className={variantSelectorStyles.groupHeader}>
        <p id={titleId} className={variantSelectorStyles.groupTitle}>
          {groupKey}
        </p>
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
