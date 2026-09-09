import { useCallback, type ChangeEvent } from "react";
import { ALL_STATUSES_VALUE } from "./OrderStatusOptionsList.component";

interface UseAdminOrdersFiltersHandlersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function useAdminOrdersFiltersHandlers({
  onSearchChange,
  onStatusChange,
}: UseAdminOrdersFiltersHandlersProps) {
  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onStatusChange(value === ALL_STATUSES_VALUE ? "" : value);
    },
    [onStatusChange],
  );

  return {
    handleSearchChange,
    handleStatusChange,
  };
}
