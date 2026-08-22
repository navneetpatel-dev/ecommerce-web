/**
 * Centralized user-facing copy (Rule 8). Domain subsets live beside this
 * file and are merged into the single `LABELS` object consumed app-wide.
 */
import { commerceLabels } from "./labels/commerce";
import { authLabels } from "./labels/auth";
import { navigationLabels } from "./labels/navigation";
import { adminNavigationLabels } from "./labels/adminNavigation";
import { workspaceNavLabels } from "./labels/workspaceNav";
import { returnsLabels } from "./labels/returns";
import { availabilityLabels } from "./labels/availability";
import { couponsLabels } from "./labels/coupons";
import { tablesLabels } from "./labels/tables";
import { settingsLabels } from "./labels/settings";
import { reportsLabels } from "./labels/reports";
import { walletLabels } from "./labels/wallet";
import { returnsTimelinesLabels } from "./labels/returnsTimelines";
import { walletReportsLabels } from "./labels/walletReports";
import { ticketsLabels } from "./labels/tickets";
import { bugsLabels } from "./labels/bugs";

export const LABELS = {
  ...commerceLabels,
  ...authLabels,
  ...navigationLabels,
  ...adminNavigationLabels,
  ...workspaceNavLabels,
  ...returnsLabels,
  ...availabilityLabels,
  ...couponsLabels,
  ...tablesLabels,
  ...settingsLabels,
  ...reportsLabels,
  ...walletLabels,
  ...returnsTimelinesLabels,
  ...walletReportsLabels,
  ...ticketsLabels,
  ...bugsLabels,
} as const;

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN_ORDER_MANAGER: "ADMIN_ORDER_MANAGER",
  ADMIN_CATALOG_MANAGER: "ADMIN_CATALOG_MANAGER",
  VENDOR_OWNER: "VENDOR_OWNER",
  VENDOR_STAFF: "VENDOR_STAFF",
  CUSTOMER: "CUSTOMER",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];
export const ROLE_VALUES = Object.values(ROLES) as [RoleName, ...RoleName[]];

export const ROLE_LABELS: Record<RoleName, string> = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN_ORDER_MANAGER]: "Order Manager",
  [ROLES.ADMIN_CATALOG_MANAGER]: "Catalog Manager",
  [ROLES.VENDOR_OWNER]: "Vendor Owner",
  [ROLES.VENDOR_STAFF]: "Vendor Staff",
  [ROLES.CUSTOMER]: "Customer",
};

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN_ORDER_MANAGER,
  ROLES.ADMIN_CATALOG_MANAGER,
] as const;

export const VENDOR_ROLES = [ROLES.VENDOR_OWNER, ROLES.VENDOR_STAFF] as const;
