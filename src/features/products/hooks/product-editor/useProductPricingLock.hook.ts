"use client";

import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { PricingLock } from "../../types/product-editor/types";

interface PricingLockProduct {
  status?: string | null;
  listedByPlatform?: boolean;
  vendorId?: string | null;
}

export interface ProductPricingLock {
  lock: PricingLock;
  /** A written reason must accompany a price change (live vendor product, edited by the platform). */
  reasonRequired: boolean;
}

const UNPUBLISHED = new Set(["DRAFT", "REJECTED"]);

/**
 * Mirrors the API's pricing policy so the form never offers what will be refused:
 * the vendor is free on their own store; the platform admin only while a platform-listed
 * product is unpublished, or with `product.pricing` and a written reason.
 */
export function useProductPricingLock(
  product?: PricingLockProduct | null,
): ProductPricingLock {
  const { hasPermission } = usePermissions();
  const user = useAuthStore((state) => state.currentUser);

  const inOwnStore = Boolean(user?.vendorId);
  if (inOwnStore || !product) {
    return { lock: { locked: false }, reasonRequired: false };
  }
  const platformOwned = !product.vendorId;
  const unpublishedListing =
    Boolean(product.listedByPlatform) && UNPUBLISHED.has(product.status ?? "");
  if (platformOwned || unpublishedListing) {
    return { lock: { locked: false }, reasonRequired: false };
  }
  if (hasPermission(PERMISSIONS.PRODUCT_PRICING)) {
    return { lock: { locked: false }, reasonRequired: true };
  }
  return {
    lock: { locked: true, hint: LABELS.pricingLockedHint },
    reasonRequired: false,
  };
}
