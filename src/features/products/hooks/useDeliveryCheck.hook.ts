"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PINCODE_PATTERN } from "@/shared/constants/pincode";
import { checkoutApi, checkoutKeys } from "@/features/checkout";

interface UseDeliveryCheckParams {
  productId: string;
  variantId?: string | null;
  vendorId?: string | null;
}

/**
 * Owns the PDP delivery-pincode check: submitted pincode state, shipping-rate
 * query and derived serviceability flags (Rule 1/12).
 */
export function useDeliveryCheck(params: UseDeliveryCheckParams) {
  const [pincode, setPincode] = useState("");
  const [submitted, setSubmitted] = useState("");

  const quoteQuery = useQuery({
    queryKey: checkoutKeys.pdpShippingRates(
      submitted,
      params.productId,
      params.variantId,
    ),
    queryFn: () =>
      checkoutApi.getShippingRates(submitted, {
        productId: params.productId,
        variantId: params.variantId ?? undefined,
        vendorId: params.vendorId ?? undefined,
      }),
    enabled: PINCODE_PATTERN.test(submitted),
  });

  const isValidPincode = (value: string) => PINCODE_PATTERN.test(value.trim());

  const handleCheck = () => {
    const next = pincode.trim();
    if (!isValidPincode(next)) return;
    setSubmitted(next);
  };

  return {
    pincode,
    setPincode,
    submitted,
    quoteQuery,
    handleCheck,
    isValidPincode,
  };
}
