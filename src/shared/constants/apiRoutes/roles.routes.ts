/** Admin role/permission management API path builders. */
export const rolesRoutes = {
  list: "/api/roles",
  permissions: "/api/roles/permissions",
  detail: (id: string) => `/api/roles/${id}`,
  setPermissions: (id: string) => `/api/roles/${id}/permissions`,
} as const;
