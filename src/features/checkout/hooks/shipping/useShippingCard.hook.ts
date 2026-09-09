"use client";

import { useShippingRates } from "../../api/checkout/checkout.queries";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingRate } from "@/shared/api/types";

export function useShippingCard(pincode: string, vendorId: string) {
  const {
    data: rates = [],
    isLoading,
    isError,
    error,
  } = useShippingRates(pincode, vendorId);

  const options = (rates as ShippingRate[]).filter(
    (rate) =>
      rate.method === SHIPPING_METHOD.STANDARD ||
      rate.method === SHIPPING_METHOD.EXPRESS,
  );

  return { options, isLoading, isError, error };
}
