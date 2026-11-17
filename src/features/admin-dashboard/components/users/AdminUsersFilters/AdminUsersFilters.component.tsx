"use client";

import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { adminUsersFiltersLabels } from "@/shared/constants/labels/adminUsersFilters";
import {
  UserStatusOptionsList,
  ALL_STATUSES_VALUE,
} from "./UserStatusOptionsList.component";
import {
  UserRoleOptionsList,
  ALL_ROLES_VALUE,
} from "./UserRoleOptionsList.component";
import { useAdminUsersFiltersHandlers } from "../../../hooks/users/useAdminUsersFiltersHandlers.hook";

export type AdminUsersFiltersProps = {
  search: string;
  status: string;
  roleId: string;
  roles: { id: string; name: string }[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleIdChange: (value: string) => void;
  onClear: () => void;
};

export function AdminUsersFilters({
  search,
  status,
  roleId,
  roles,
  onSearchChange,
  onStatusChange,
  onRoleIdChange,
  onClear,
}: AdminUsersFiltersProps) {
  const { handleSearchChange, handleStatusChange, handleRoleIdChange } =
    useAdminUsersFiltersHandlers({
      onSearchChange,
      onStatusChange,
      onRoleIdChange,
    });

  const activeCount =
    (search.trim() ? 1 : 0) +
    (status && status !== ALL_STATUSES_VALUE ? 1 : 0) +
    (roleId && roleId !== ALL_ROLES_VALUE ? 1 : 0);

  return (
    <CollapsibleTableFilters
      title={adminUsersFiltersLabels.usersFilters}
      activeCount={activeCount}
      onClear={onClear}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
        <FormFieldFrame
          label={adminUsersFiltersLabels.usersSearch}
          htmlFor="admin-users-filter-search"
        >
          <SearchInput
            id="admin-users-filter-search"
            value={search}
            onChange={handleSearchChange}
            onClear={() => onSearchChange("")}
            placeholder={adminUsersFiltersLabels.usersSearchPlaceholder}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={adminUsersFiltersLabels.usersStatus}
          htmlFor="admin-users-filter-status"
        >
          <Select
            value={status || ALL_STATUSES_VALUE}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="admin-users-filter-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <UserStatusOptionsList />
            </SelectContent>
          </Select>
        </FormFieldFrame>

        <FormFieldFrame
          label={adminUsersFiltersLabels.usersRole}
          htmlFor="admin-users-filter-role"
        >
          <Select
            value={roleId || ALL_ROLES_VALUE}
            onValueChange={handleRoleIdChange}
          >
            <SelectTrigger id="admin-users-filter-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <UserRoleOptionsList roles={roles} />
            </SelectContent>
          </Select>
        </FormFieldFrame>
      </div>
    </CollapsibleTableFilters>
  );
}
