import { useEffect, useMemo } from "react";
import { useCheckoutStore } from "@/features/checkout/store/checkout.store";
import {
  useAddresses,
  useCreateAddress,
} from "../../api/checkout/checkout.queries";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";
import { useCart, groupItemsByVendor } from "@/features/cart";
import {
  useDeliveryLocation,
  useDeliveryServiceability,
} from "@/shared/hooks/delivery/useDeliveryLocation.hook";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import type { Address } from "@/shared/api/types";

export type AddressDraft = Omit<Address, "id" | "userId">;

/**
 * Checkout address concern (Rule 3): saved-address loading, default
 * selection, sign-in-guarded address creation, and the delivery area the chosen
 * address implies.
 */
export function useCheckoutAddresses() {
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const addressId = useCheckoutStore((s) => s.addressId);
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const { requireAuth } = useRequireAuth();
  const { data: cart } = useCart();
  const { setDeliveryLocation } = useDeliveryLocation();

  // Prefer default address, otherwise first saved address
  useEffect(() => {
    if (!addresses?.length) return;
    const stillValid = addressId && addresses.some((a) => a.id === addressId);
    if (stillValid) return;
    const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (preferred) setAddress(preferred.id);
  }, [addresses, addressId, setAddress]);

  // The chosen address *is* the delivery area: the serviceability gate, the cart chip and
  // the address-step notice all have to follow the address the customer picked, not a
  // pincode typed earlier in the funnel.
  useEffect(() => {
    const selected = addresses?.find((address) => address.id === addressId);
    if (!selected?.pincode) return;
    setDeliveryLocation(selected.pincode, selected.state ?? null);
  }, [addresses, addressId, setDeliveryLocation]);

  // One vendor that doesn't serve the area blocks the address step: the order would be
  // rejected at payment, so it has to surface where the address is chosen.
  const vendorIds = useMemo(
    () => Object.keys(cart?.items ? groupItemsByVendor(cart.items) : {}),
    [cart?.items],
  );
  const deliveryArea = useDeliveryServiceability(vendorIds);

  const onCreateAddress = (body: AddressDraft) => {
    const authed = requireAuth({
      title: LABELS.addShippingAddressTitle,
      message: LABELS.addShippingAddressMessage,
      redirectTo: PATHS.checkout,
    });
    if (!authed) {
      return Promise.reject(new Error(LABELS.signInRequired));
    }
    return new Promise<void>((resolve, reject) => {
      createAddress.mutate(body, {
        onSuccess: (created) => {
          setAddress(created.id);
          resolve();
        },
        onError: (err) => reject(err),
      });
    });
  };

  return {
    addressId,
    addresses,
    deliveryArea,
    isLoadingAddresses: isLoading,
    isCreatingAddress: createAddress.isPending,
    onSelectAddress: setAddress,
    onCreateAddress,
  };
}
