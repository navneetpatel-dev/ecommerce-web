"use client";

import { useMemo } from "react";
import type { CartItem } from "@/shared/api/types";

interface UseShippingStepParams {
  groupedByVendor: Record<string, CartItem[]>;
  pincode: string;
}

export function useShippingStep({
  groupedByVendor,
  pincode,
}: UseShippingStepParams) {
  const vendors = useMemo(() => {
    return Object.entries(groupedByVendor);
  }, [groupedByVendor]);

  const vendorCountText = useMemo(() => {
    const count = vendors.length;
    return `${count} ${count === 1 ? "vendor" : "vendors"} in this order`;
  }, [vendors.length]);

  const hasPincode = Boolean(pincode);

  return {
    vendors,
    vendorCountText,
    hasPincode,
  };
}
