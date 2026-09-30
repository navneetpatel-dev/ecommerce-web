"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  serviceabilityApi,
  serviceabilityKeys,
} from "@/shared/api/serviceability.api";
import { useDeliveryLocationStore } from "@/shared/stores/delivery-location/deliveryLocation.store";
import { resolveDeliveryAreaStatus } from "@/shared/utils/delivery/deliveryArea";

/**
 * The shared delivery area, checked against the basket's vendors (Rule 3: one owner).
 *
 * `useDeliveryLocation` defers the sessionStorage read to an effect because storage is not
 * available during SSR; until it runs there is simply no area, and no gate.
 */
export function useDeliveryLocation() {
  const pincode = useDeliveryLocationStore((state) => state.pincode);
  const state = useDeliveryLocationStore((state) => state.state);
  const setDeliveryLocation = useDeliveryLocationStore(
    (state) => state.setDeliveryLocation,
  );
  const clearDeliveryLocation = useDeliveryLocationStore(
    (state) => state.clearDeliveryLocation,
  );
  const hydrate = useDeliveryLocationStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return {
    pincode,
    state,
    setDeliveryLocation,
    clearDeliveryLocation,
  };
}

/**
 * Is the basket deliverable to the area the customer checked?
 *
 * A failed or unsettled check is deliberately *not* an answer: only a "no" from the API
 * closes the gates, so a flaky network can't strand a customer who would have been served.
 * The quote's own 422 (`SHIPPING_RATE_UNAVAILABLE`) stays the backstop at payment.
 */
export function useDeliveryServiceability(vendorIds: string[]) {
  const { pincode, state } = useDeliveryLocation();
  const sortedVendorIds = [...new Set(vendorIds)].sort();
  const enabled = Boolean(pincode) && sortedVendorIds.length > 0;

  const query = useQuery({
    queryKey: serviceabilityKeys.check(pincode ?? "", sortedVendorIds),
    queryFn: () =>
      serviceabilityApi.check(pincode!, { state, vendorIds: sortedVendorIds }),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const status = resolveDeliveryAreaStatus(query.data);

  return {
    pincode,
    status,
    isChecking: enabled && query.isFetching,
    /** The hard gate: the API said this basket can't be delivered to that area. */
    isUnserviceable: status.known && !status.serviceable,
    unserviceableVendorIds: status.unserviceableVendorIds,
  };
}
