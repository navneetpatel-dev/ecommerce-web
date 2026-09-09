import { useMutation } from "@tanstack/react-query";
import { stockAlertsApi } from "./stockAlerts.api";

export function useCreateStockAlert() {
  return useMutation({
    mutationFn: ({
      variantId,
      guestEmail,
    }: {
      variantId: string;
      guestEmail?: string;
    }) => stockAlertsApi.subscribe(variantId, guestEmail),
  });
}

export function useRemoveStockAlert() {
  return useMutation({
    mutationFn: ({ id, guestEmail }: { id: string; guestEmail?: string }) =>
      stockAlertsApi.unsubscribe(id, guestEmail),
  });
}
