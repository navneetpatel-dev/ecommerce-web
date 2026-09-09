import { variantSelectorStyles } from "./variantSelector.styles";
import { VariantAttributeGroup } from "./VariantAttributeGroup.component";

interface VariantAttributeGroupsListProps {
  attributeGroups: Record<string, string[]>;
  isAvailable: (key: string, value: string) => boolean;
  isActive: (key: string, value: string) => boolean;
  onSelectValue: (key: string, value: string) => void;
}

export function VariantAttributeGroupsList({
  attributeGroups,
  isAvailable,
  isActive,
  onSelectValue,
}: VariantAttributeGroupsListProps) {
  const entries = Object.entries(attributeGroups);
  if (entries.length === 0) return null;

  return (
    <div className={variantSelectorStyles.groupsWrapper}>
      {entries.map(([key, values]) => (
        <VariantAttributeGroup
          key={key}
          groupKey={key}
          values={values}
          isAvailable={isAvailable}
          isActive={isActive}
          onSelectValue={onSelectValue}
        />
      ))}
    </div>
  );
}
