import { SelectItem } from "@/shared/components/ui/select";
import { auditFiltersLabels } from "@/shared/constants/labels/auditFilters";

const ALL_ENTITY_TYPES_VALUE = "__all__";

interface EntityTypeOptionsListProps {
  entityTypes: readonly string[];
}

export function EntityTypeOptionsList({
  entityTypes,
}: EntityTypeOptionsListProps) {
  return (
    <>
      <SelectItem value={ALL_ENTITY_TYPES_VALUE}>
        {auditFiltersLabels.auditAllEntityTypes}
      </SelectItem>
      {entityTypes.map((value) => (
        <SelectItem key={value} value={value}>
          {value}
        </SelectItem>
      ))}
    </>
  );
}

export { ALL_ENTITY_TYPES_VALUE };
