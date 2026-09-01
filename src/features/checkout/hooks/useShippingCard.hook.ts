"use client";

import { useShippingRates } from "../api/checkout.queries";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingRate } from "@/shared/api/types";

export function useShippingCard(pincode: string, weightGrams: number) {
  const {
    data: rates = [],
    isLoading,
    isError,
    error,
  } = useShippingRates(pincode, weightGrams);

  const options = (rates as ShippingRate[]).filter(
    (rate) =>
      rate.method === SHIPPING_METHOD.STANDARD ||
      rate.method === SHIPPING_METHOD.EXPRESS,
  );

  return { options, isLoading, isError, error };
}
