import { useEffect } from "react";
import { useCheckoutStore } from "@/shared/stores/checkout.store";
import { useAddresses, useCreateAddress } from "../api/checkout.queries";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth.hook";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import type { Address } from "@/shared/api/types";

export type AddressDraft = Omit<Address, "id" | "userId">;

/**
 * Checkout address concern (Rule 3): saved-address loading, default
 * selection, and sign-in-guarded address creation.
 */
export function useCheckoutAddresses() {
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const addressId = useCheckoutStore((s) => s.addressId);
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const { requireAuth } = useRequireAuth();

  // Prefer default address, otherwise first saved address
  useEffect(() => {
    if (!addresses?.length) return;
    const stillValid = addressId && addresses.some((a) => a.id === addressId);
    if (stillValid) return;
    const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (preferred) setAddress(preferred.id);
  }, [addresses, addressId, setAddress]);

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
    isLoadingAddresses: isLoading,
    isCreatingAddress: createAddress.isPending,
    onSelectAddress: setAddress,
    onCreateAddress,
  };
}
