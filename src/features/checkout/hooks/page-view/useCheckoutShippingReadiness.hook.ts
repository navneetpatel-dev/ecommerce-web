"use client";

import { useMemo } from "react";
import { groupItemsByVendor } from "@/features/cart";
import type { Address, CartItem } from "@/shared/api/types";
import {
  hasUnavailableCartItems,
  isShippingReadyForAllVendors,
} from "../../utils/checkout/checkoutDerivedState";
import { useShippingStep } from "../shipping/useShippingStep.hook";

interface UseCheckoutShippingReadinessArgs {
  items: CartItem[] | undefined;
  addresses: Address[] | undefined;
  addressId: string | null | undefined;
  shippingMethodByVendor: Record<string, string | undefined>;
}

/**
 * The cart split per seller, and whether every seller can ship to the chosen
 * address with a method picked (rates resolved, none unservable).
 */
export function useCheckoutShippingReadiness({
  items,
  addresses,
  addressId,
  shippingMethodByVendor,
}: UseCheckoutShippingReadinessArgs) {
  const groupedByVendor = useMemo(
    () => (items ? groupItemsByVendor(items) : {}),
    [items],
  );

  const hasUnavailableItems = useMemo(
    () => hasUnavailableCartItems(items),
    [items],
  );

  const checkoutPincode = useMemo(() => {
    const selected = addresses?.find((address) => address.id === addressId);
    return selected?.pincode?.trim() ?? "";
  }, [addresses, addressId]);

  const shippingStatus = useShippingStep({
    groupedByVendor,
    selectedMethods: shippingMethodByVendor,
    pincode: checkoutPincode,
  });

  const shippingReady = useMemo(() => {
    if (!checkoutPincode) return false;
    if (
      shippingStatus.isRateLookupPending ||
      shippingStatus.hasUnservableVendor
    ) {
      return false;
    }
    return isShippingReadyForAllVendors(
      groupedByVendor,
      shippingMethodByVendor,
    );
  }, [
    checkoutPincode,
    groupedByVendor,
    shippingMethodByVendor,
    shippingStatus.isRateLookupPending,
    shippingStatus.hasUnservableVendor,
  ]);

  return { groupedByVendor, hasUnavailableItems, shippingReady };
}
