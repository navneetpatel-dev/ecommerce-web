import { Lock, MapPin, Package, Shield, User, UserRound } from "lucide-react";
import { LABELS, type RoleName } from "@/shared/constants/labels";
import { isWorkspaceRole } from "@/shared/utils/roles";
import type { AccountNavItem, AccountSectionId } from "./types";

export const ACCOUNT_SECTIONS: AccountNavItem[] = [
  {
    id: "overview",
    label: LABELS.overview,
    description: "Profile snapshot and quick links",
    icon: UserRound,
  },
  {
    id: "personal",
    label: LABELS.personalInfo,
    description: "Name, phone, and email",
    icon: User,
  },
  {
    id: "security",
    label: LABELS.security,
    description: "Password and sessions",
    icon: Lock,
  },
  {
    id: "addresses",
    label: LABELS.addresses,
    description: "Delivery addresses",
    icon: MapPin,
  },
  {
    id: "orders",
    label: LABELS.orders,
    description: "Orders, wishlist, returns",
    icon: Package,
  },
  {
    id: "privacy",
    label: LABELS.privacy,
    description: LABELS.privacySectionDescCustomer,
    icon: Shield,
  },
];

/** Staff (admin/vendor) profile — no shopper-only sections. */
const WORKSPACE_ACCOUNT_SECTION_IDS: AccountSectionId[] = [
  "personal",
  "security",
  "privacy",
];

export function accountSectionsForRole(
  role: RoleName | null | undefined,
): AccountNavItem[] {
  if (isWorkspaceRole(role)) return workspaceAccountSections();
  return ACCOUNT_SECTIONS;
}

/** Staff sections before role hydrates on /admin/profile or /vendor/.../profile. */
export function workspaceAccountSections(): AccountNavItem[] {
  return ACCOUNT_SECTIONS.filter((section) =>
    WORKSPACE_ACCOUNT_SECTION_IDS.includes(section.id),
  ).map((section) =>
    section.id === "privacy"
      ? { ...section, description: LABELS.privacySectionDescWorkspace }
      : section,
  );
}

export {
  DEFAULT_ACCOUNT_SECTION,
  DEFAULT_WORKSPACE_ACCOUNT_SECTION,
} from "@/shared/constants/profileSections";

/** Filename prefix for the customer data-export download (Rule 8). */
export const ACCOUNT_EXPORT_FILENAME_PREFIX = "account-export";

export const ACCOUNT_SECTION_IDS = ACCOUNT_SECTIONS.map((s) => s.id);

export function isAccountSectionId(
  value: string | null | undefined,
): value is AccountSectionId {
  return Boolean(
    value && ACCOUNT_SECTION_IDS.includes(value as AccountSectionId),
  );
}
