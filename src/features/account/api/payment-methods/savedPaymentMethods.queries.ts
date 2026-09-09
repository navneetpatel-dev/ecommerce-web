import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { savedPaymentMethodsApi } from "./savedPaymentMethods.api";
import type { SavedPaymentMethod } from "../../types/layout/types";

export const SAVED_PAYMENT_METHODS_QUERY_KEY = [
  "saved-payment-methods",
] as const;

export function useSavedPaymentMethods() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: SAVED_PAYMENT_METHODS_QUERY_KEY,
    queryFn: () => savedPaymentMethodsApi.list(),
    enabled: Boolean(accessToken),
  });
}

export function useDeleteSavedPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => savedPaymentMethodsApi.remove(id),
    onSuccess: (_void, id) => {
      queryClient.setQueryData<SavedPaymentMethod[]>(
        SAVED_PAYMENT_METHODS_QUERY_KEY,
        (prev) => (prev ?? []).filter((m) => m.id !== id),
      );
    },
  });
}
