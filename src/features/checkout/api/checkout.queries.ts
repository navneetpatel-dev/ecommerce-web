import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutApi } from "./checkout.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { PINCODE_PATTERN } from "@/shared/constants/pincode";
import type { Address } from "@/shared/api/types";

export type CheckoutQuoteInput = {
  addressId: string | null;
  shippingMethodByVendor: Record<string, string>;
  couponCode: string | null;
  walletAmountToUse?: number;
};

export const checkoutKeys = {
  addresses: ["addresses"] as const,
  shippingRates: (pincode: string, weightGrams: number) =>
    ["shipping", "rates", pincode, weightGrams] as const,
  pdpShippingRates: (
    pincode: string,
    productId: string,
    variantId?: string | null,
  ) => ["shipping", "pdp", pincode, productId, variantId] as const,
  quote: (input: CheckoutQuoteInput) => ["checkout", "quote", input] as const,
};

function sortAddresses(list: Address[]) {
  return [...list].sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return 0;
  });
}

export function useAddresses() {
  const currentUser = useAuthStore((s) => s.currentUser);

  return useQuery({
    queryKey: checkoutKeys.addresses,
    queryFn: () => checkoutApi.getAddresses(),
    enabled: Boolean(currentUser),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof checkoutApi.createAddress>[0]) =>
      checkoutApi.createAddress(body),
    onSuccess: (created) => {
      queryClient.setQueryData<(typeof created)[]>(
        checkoutKeys.addresses,
        (prev) => {
          const list = prev ?? [];
          const without = list.filter((a) => a.id !== created.id);
          if (created.isDefault) {
            return sortAddresses([
              created,
              ...without.map((a) => ({ ...a, isDefault: false })),
            ]);
          }
          return sortAddresses([created, ...without]);
        },
      );
      void queryClient.invalidateQueries({ queryKey: checkoutKeys.addresses });
    },
  });
}

export function useShippingRates(pincode: string, weightGrams: number) {
  return useQuery({
    queryKey: checkoutKeys.shippingRates(pincode, weightGrams),
    queryFn: () => checkoutApi.getShippingRates(pincode, weightGrams),
    enabled: PINCODE_PATTERN.test(pincode) && weightGrams > 0,
  });
}

export function useCheckoutQuote(input: CheckoutQuoteInput) {
  return useQuery({
    queryKey: checkoutKeys.quote(input),
    queryFn: () =>
      checkoutApi.getCheckoutQuote(
        input as Parameters<typeof checkoutApi.getCheckoutQuote>[0],
      ),
    enabled:
      !!input.addressId && Object.keys(input.shippingMethodByVendor).length > 0,
  });
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: (body: Parameters<typeof checkoutApi.placeOrder>[0]) =>
      checkoutApi.placeOrder(body),
  });
}
