import {
  ADMIN_ROLES,
  DELIVERY_ROLES,
  ROLES,
  VENDOR_ROLES,
  type RoleName,
} from "@/shared/constants/labels";

export function isAdminRole(role: RoleName | null | undefined): boolean {
  return role != null && (ADMIN_ROLES as readonly string[]).includes(role);
}

export function isVendorRole(role: RoleName | null | undefined): boolean {
  return role != null && (VENDOR_ROLES as readonly string[]).includes(role);
}

export function isDeliveryRole(role: RoleName | null | undefined): boolean {
  return role != null && (DELIVERY_ROLES as readonly string[]).includes(role);
}

export function isCustomerRole(role: RoleName | null | undefined): boolean {
  return role === ROLES.CUSTOMER;
}

/** Admin or vendor staff — not a shopper account. */
export function isWorkspaceRole(role: RoleName | null | undefined): boolean {
  return isAdminRole(role) || isVendorRole(role) || isDeliveryRole(role);
}
