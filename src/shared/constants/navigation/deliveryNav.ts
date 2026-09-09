import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";

export const DELIVERY_NAV = [
  {
    href: PATHS.delivery.today,
    label: LABELS.today,
    permissions: [
      PERMISSIONS.SHIPMENT_DELIVERY_UPDATE,
      PERMISSIONS.RETURN_PICKUP_UPDATE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.delivery.deliveries,
    label: LABELS.deliveries,
    permissions: [PERMISSIONS.SHIPMENT_DELIVERY_UPDATE] as PermissionKey[],
  },
  {
    href: PATHS.delivery.pickups,
    label: LABELS.pickups,
    permissions: [PERMISSIONS.RETURN_PICKUP_UPDATE] as PermissionKey[],
  },
  {
    href: PATHS.delivery.history,
    label: LABELS.history,
    permissions: [
      PERMISSIONS.SHIPMENT_DELIVERY_UPDATE,
      PERMISSIONS.RETURN_PICKUP_UPDATE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.delivery.profile,
    label: LABELS.profile,
    permissions: [
      PERMISSIONS.SHIPMENT_DELIVERY_UPDATE,
      PERMISSIONS.RETURN_PICKUP_UPDATE,
    ] as PermissionKey[],
  },
] as const;

export function deliveryPermissionsForPath(
  pathname: string,
): PermissionKey | PermissionKey[] {
  const match = DELIVERY_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (!match) return PERMISSIONS.SHIPMENT_DELIVERY_UPDATE;
  return match.permissions.length === 1
    ? match.permissions[0]!
    : [...match.permissions];
}
