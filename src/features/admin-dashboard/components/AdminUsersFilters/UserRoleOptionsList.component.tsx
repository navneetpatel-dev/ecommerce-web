import { SelectItem } from "@/shared/components/ui/select";
import { ROLE_LABELS, type RoleName } from "@/shared/constants/labels";
import { adminUsersFiltersLabels } from "@/shared/constants/labels/adminUsersFilters";

const ALL_ROLES_VALUE = "__all_roles__";

interface RoleOption {
  id: string;
  name: string;
}

interface UserRoleOptionsListProps {
  roles: RoleOption[];
}

function roleLabel(name: string): string {
  return ROLE_LABELS[name as RoleName] ?? name.replace(/_/g, " ");
}

export function UserRoleOptionsList({ roles }: UserRoleOptionsListProps) {
  return (
    <>
      <SelectItem value={ALL_ROLES_VALUE}>
        {adminUsersFiltersLabels.usersAllRoles}
      </SelectItem>
      {roles.map((role) => (
        <SelectItem key={role.id} value={role.id}>
          {roleLabel(role.name)}
        </SelectItem>
      ))}
    </>
  );
}

export { ALL_ROLES_VALUE };
