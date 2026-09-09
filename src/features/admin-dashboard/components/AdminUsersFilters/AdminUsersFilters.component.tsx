"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { adminUsersFiltersLabels } from "@/shared/constants/labels/adminUsersFilters";
import { adminUsersFiltersStyles } from "./adminUsersFilters.styles";
import {
  UserStatusOptionsList,
  ALL_STATUSES_VALUE,
} from "./UserStatusOptionsList.component";
import {
  UserRoleOptionsList,
  ALL_ROLES_VALUE,
} from "./UserRoleOptionsList.component";
import { useAdminUsersFiltersHandlers } from "./useAdminUsersFiltersHandlers.hook";

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

  return (
    <FormSection title={adminUsersFiltersLabels.usersFilters} columns={3}>
      <FormFieldFrame
        label={adminUsersFiltersLabels.usersSearch}
        htmlFor="admin-users-filter-search"
      >
        <Input
          id="admin-users-filter-search"
          value={search}
          onChange={handleSearchChange}
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

      <div className={adminUsersFiltersStyles.clearButtonWrapper}>
        <Button type="button" variant="outline" onClick={onClear}>
          {adminUsersFiltersLabels.usersClearFilters}
        </Button>
      </div>
    </FormSection>
  );
}
