/** Admin role & permission management copy; merged via labels.ts. */
export const adminRolesLabels = {
  roles: "Roles",
  permissions: "Permissions",
  rolesHint:
    "Custom roles can be granted a specific set of permissions. Built-in roles cannot be renamed or deleted.",
  createRole: "Create role",
  newRoleNamePlaceholder: "e.g. SUPPORT_AUDITOR",
  couldNotCreateRole: "Could not create role",
  couldNotDeleteRole: "Could not delete role",
  couldNotLoadRoles: "Could not load roles",
  builtInRoleBadge: "Built-in",
  managePermissions: "Manage permissions",
  managePermissionsFor: "Permissions for {name}",
  permissionCount: "{count} permission(s)",
  savePermissions: "Save permissions",
  confirmDeleteRoleTitle: "Delete this role?",
  confirmDeleteRoleBody:
    'Delete role "{name}"? This cannot be undone. Users must be reassigned before a role can be deleted.',
} as const;
