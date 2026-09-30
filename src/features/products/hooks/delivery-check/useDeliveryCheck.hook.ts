"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PINCODE_PATTERN } from "@/shared/constants/geo/pincode";
import { checkoutApi, checkoutKeys } from "@/features/checkout";
import { useDeliveryLocation } from "@/shared/hooks/delivery/useDeliveryLocation.hook";

interface UseDeliveryCheckParams {
  productId: string;
  variantId?: string | null;
  vendorId?: string | null;
}

/**
 * Owns the PDP delivery-pincode check: submitted pincode state, shipping-rate
 * query and derived serviceability flags (Rule 1/12).
 *
 * The check itself is shared funnel-wide (see `useDeliveryLocationStore`) — the area a
 * customer checked here is the area the cart and checkout gate on, and an area they set
 * elsewhere is checked here without retyping.
 */
export function useDeliveryCheck(params: UseDeliveryCheckParams) {
  const { pincode: deliveryAreaPincode, setDeliveryLocation } =
    useDeliveryLocation();
  const [pincode, setPincode] = useState("");
  const [submitted, setSubmitted] = useState("");

  useEffect(() => {
    if (!deliveryAreaPincode) return;
    setSubmitted(deliveryAreaPincode);
    setPincode((current) => current || deliveryAreaPincode);
  }, [deliveryAreaPincode]);

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
    setDeliveryLocation(next);
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
