"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { CartItem } from "@/shared/api/types";
import { PINCODE_PATTERN } from "@/shared/constants/geo/pincode";
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

  const { isRateLookupPending, unservableVendorIds } = useMemo(() => {
    // A saved address can still hold a non-6-digit pincode. The rate query stays
    // disabled for it, so treat it as unservable instead of "still loading".
    if (pincode.trim() && !PINCODE_PATTERN.test(pincode.trim())) {
      return {
        isRateLookupPending: false,
        unservableVendorIds: vendorIds,
      };
    }
    return resolveShippingSelectionStatus(
      vendorIds,
      selectedMethods,
      ratesByVendor,
    );
  }, [vendorIds, selectedMethods, ratesByVendor, pincode]);

  return {
    vendors,
    vendorCountText,
    hasPincode,
    isRateLookupPending,
    hasUnservableVendor: unservableVendorIds.length > 0,
  };
}
