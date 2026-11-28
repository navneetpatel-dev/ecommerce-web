"use client";

import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";

/** Commission is the platform's pricing: only holders of `product.pricing` may set it (API rule). */
export function useCommissionLock() {
  const { hasPermission } = usePermissions();
  const locked = !hasPermission(PERMISSIONS.PRODUCT_PRICING);
  return {
    locked,
    hint: locked
      ? LABELS.categoryCommissionLockedHint
      : LABELS.categoryCommissionRateHint,
  };
}
