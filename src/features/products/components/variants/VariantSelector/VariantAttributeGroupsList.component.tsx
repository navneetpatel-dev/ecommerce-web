import { variantSelectorStyles } from "../../../styles/variants/variantSelector.styles";
import { VariantAttributeGroup } from "./VariantAttributeGroup.component";

interface VariantAttributeGroupsListProps {
  attributeGroups: Record<string, string[]>;
  isAvailable: (key: string, value: string) => boolean;
  changesOtherChoices?: (key: string, value: string) => string[];
  isActive: (key: string, value: string) => boolean;
  onSelectValue: (key: string, value: string) => void;
}

export function VariantAttributeGroupsList({
  attributeGroups,
  isAvailable,
  changesOtherChoices,
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
          changesOtherChoices={changesOtherChoices}
          isActive={isActive}
          onSelectValue={onSelectValue}
        />
      ))}
    </div>
  );
}
