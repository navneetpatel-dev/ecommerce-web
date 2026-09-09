import { useCallback, type ChangeEvent } from "react";
import { ALL_STATUSES_VALUE } from "../../components/users/AdminUsersFilters/UserStatusOptionsList.component";
import { ALL_ROLES_VALUE } from "../../components/users/AdminUsersFilters/UserRoleOptionsList.component";

interface UseAdminUsersFiltersHandlersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleIdChange: (value: string) => void;
}

export function useAdminUsersFiltersHandlers({
  onSearchChange,
  onStatusChange,
  onRoleIdChange,
}: UseAdminUsersFiltersHandlersProps) {
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

  const handleRoleIdChange = useCallback(
    (value: string) => {
      onRoleIdChange(value === ALL_ROLES_VALUE ? "" : value);
    },
    [onRoleIdChange],
  );

  return {
    handleSearchChange,
    handleStatusChange,
    handleRoleIdChange,
  };
}
