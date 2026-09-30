"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { CartItem } from "@/shared/api/types";
import { shippingRatesQueryOptions } from "../../api/checkout/checkout.queries";
import {
  resolveShippingSelectionStatus,
  type VendorRateMap,
} from "../../utils/shipping/shippingSelection.utils";

interface UseShippingStepParams {
  groupedByVendor: Record<string, CartItem[]>;
  selectedMethods: Record<string, string | undefined>;
  pincode: string;
}

export function useShippingStep({
  groupedByVendor,
  selectedMethods,
  pincode,
}: UseShippingStepParams) {
  const vendors = useMemo(() => {
    return Object.entries(groupedByVendor);
  }, [groupedByVendor]);

  const vendorIds = useMemo(
    () => vendors.map(([vendorId]) => vendorId),
    [vendors],
  );

  const vendorCountText = useMemo(() => {
    const count = vendors.length;
    return `${count} ${count === 1 ? "vendor" : "vendors"} in this order`;
  }, [vendors.length]);

  const hasPincode = Boolean(pincode);

  // The same queries each shipping card runs, so both share one cache entry per vendor.
  const vendorRateQueries = useQueries({
    queries: vendorIds.map((vendorId) =>
      shippingRatesQueryOptions(pincode, vendorId),
    ),
  });

  const ratesByVendor = useMemo<VendorRateMap>(() => {
    const map: VendorRateMap = {};
    vendorIds.forEach((vendorId, index) => {
      map[vendorId] = vendorRateQueries[index]?.data;
    });
    return map;
  }, [vendorIds, vendorRateQueries]);

  const { isRateLookupPending, unservableVendorIds } = useMemo(
    () =>
      resolveShippingSelectionStatus(vendorIds, selectedMethods, ratesByVendor),
    [vendorIds, selectedMethods, ratesByVendor],
  );

  return {
    vendors,
    vendorCountText,
    hasPincode,
    isRateLookupPending,
    hasUnservableVendor: unservableVendorIds.length > 0,
  };
}
