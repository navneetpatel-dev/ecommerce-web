"use client";

import { ROLES } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";

/**
 * Vendor staff edit a store's products but not what they cost, how they are taxed or paid for
 * (price, MRP, HSN code, COD): the API refuses those, so the form disables them.
 */
export function useIsVendorStaff(): boolean {
  return useAuthStore(
    (state) => state.currentUser?.role === ROLES.VENDOR_STAFF,
  );
}
