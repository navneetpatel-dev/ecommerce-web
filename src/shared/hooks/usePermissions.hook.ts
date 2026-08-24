"use client";

import { useAuthStore } from "@/shared/stores/auth.store";
import { ROLES } from "@/shared/constants/labels";
import type { PermissionKey } from "@/shared/constants/permissions";

export function usePermissions() {
  const user = useAuthStore((state) => state.currentUser);
  const hasPermission = (key: PermissionKey | string) =>
    user?.role === ROLES.SUPER_ADMIN ||
    Boolean(user?.permissions?.includes(key));
  const hasAnyPermission = (...keys: Array<PermissionKey | string>) =>
    keys.some(hasPermission);

  return { hasPermission, hasAnyPermission };
}
