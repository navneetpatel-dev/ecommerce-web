"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { USER_STATUS } from "@/shared/constants/statuses";
import { ROLE_LABELS, type RoleName } from "@/shared/constants/labels";
import { adminUsersFiltersLabels } from "@/shared/constants/labels/adminUsersFilters";

const ALL_STATUSES_VALUE = "__all_statuses__";
const ALL_ROLES_VALUE = "__all_roles__";
const USER_STATUS_OPTIONS = Object.values(USER_STATUS);

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

function roleLabel(name: string): string {
  return ROLE_LABELS[name as RoleName] ?? name.replace(/_/g, " ");
}

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
  return (
    <FormSection title={adminUsersFiltersLabels.usersFilters} columns={3}>
      <FormFieldFrame
        label={adminUsersFiltersLabels.usersSearch}
        htmlFor="admin-users-filter-search"
      >
        <Input
          id="admin-users-filter-search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={adminUsersFiltersLabels.usersSearchPlaceholder}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={adminUsersFiltersLabels.usersStatus}
        htmlFor="admin-users-filter-status"
      >
        <Select
          value={status || ALL_STATUSES_VALUE}
          onValueChange={(value) =>
            onStatusChange(value === ALL_STATUSES_VALUE ? "" : value)
          }
        >
          <SelectTrigger id="admin-users-filter-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES_VALUE}>
              {adminUsersFiltersLabels.usersAllStatuses}
            </SelectItem>
            {USER_STATUS_OPTIONS.map((value) => (
              <SelectItem key={value} value={value}>
                {value.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>

      <FormFieldFrame
        label={adminUsersFiltersLabels.usersRole}
        htmlFor="admin-users-filter-role"
      >
        <Select
          value={roleId || ALL_ROLES_VALUE}
          onValueChange={(value) =>
            onRoleIdChange(value === ALL_ROLES_VALUE ? "" : value)
          }
        >
          <SelectTrigger id="admin-users-filter-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ROLES_VALUE}>
              {adminUsersFiltersLabels.usersAllRoles}
            </SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {roleLabel(role.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>

      <div className="flex items-end">
        <Button type="button" variant="outline" onClick={onClear}>
          {adminUsersFiltersLabels.usersClearFilters}
        </Button>
      </div>
    </FormSection>
  );
}
