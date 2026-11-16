import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { ADMIN_NAV } from "./adminNav";

export function adminPermissionsForPath(
  pathname: string,
): PermissionKey | PermissionKey[] {
  const match = ADMIN_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (!match) return PERMISSIONS.ANALYTICS_VIEW;
  return match.permissions.length === 1
    ? match.permissions[0]!
    : [...match.permissions];
}
