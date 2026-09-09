import { useCallback, type ChangeEvent } from "react";
import { ALL_ENTITY_TYPES_VALUE } from "../../components/audit/AdminAuditFilters/EntityTypeOptionsList.component";

interface UseAdminAuditFiltersHandlersProps {
  onEntityTypeChange: (value: string) => void;
  onActorChange: (value: string) => void;
}

export function useAdminAuditFiltersHandlers({
  onEntityTypeChange,
  onActorChange,
}: UseAdminAuditFiltersHandlersProps) {
  const handleEntityTypeChange = useCallback(
    (value: string) => {
      onEntityTypeChange(value === ALL_ENTITY_TYPES_VALUE ? "" : value);
    },
    [onEntityTypeChange],
  );

  const handleActorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onActorChange(e.target.value);
    },
    [onActorChange],
  );

  return {
    handleEntityTypeChange,
    handleActorChange,
  };
}
