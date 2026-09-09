import { PATHS } from "@/shared/constants/paths/paths";
import type { RoleName } from "@/shared/constants/labels";
import {
  isAdminRole,
  isCustomerRole,
  isDeliveryRole,
  isVendorRole,
} from "@/shared/utils/roles/roles";
import {
  DEFAULT_ACCOUNT_SECTION,
  DEFAULT_WORKSPACE_ACCOUNT_SECTION,
} from "@/shared/constants/navigation/profileSections";

/** Base profile URL for a role (customer storefront vs admin/vendor workspace). */
export function profileBasePathForRole(
  role: RoleName | null | undefined,
): string {
  if (isAdminRole(role)) return PATHS.admin.profile;
  if (isVendorRole(role)) return PATHS.vendor.profile;
  if (isDeliveryRole(role)) return PATHS.delivery.profile;
  return PATHS.profile;
}

export function profileDefaultTabForRole(
  role: RoleName | null | undefined,
): string {
  return isCustomerRole(role) || role == null
    ? DEFAULT_ACCOUNT_SECTION
    : DEFAULT_WORKSPACE_ACCOUNT_SECTION;
}

/** Profile URL including optional tab query (omits tab when it is the role default). */
export function profilePathForRole(
  role: RoleName | null | undefined,
  tab?: string | null,
): string {
  const base = profileBasePathForRole(role);
  const defaultTab = profileDefaultTabForRole(role);
  if (!tab || tab === defaultTab) return base;
  return `${base}?tab=${encodeURIComponent(tab)}`;
}

/** True when pathname is a workspace (admin/vendor) profile surface. */
export function isWorkspaceProfilePath(pathname: string): boolean {
  return (
    pathname === PATHS.admin.profile ||
    pathname === PATHS.vendor.profile ||
    pathname === PATHS.delivery.profile
  );
}
