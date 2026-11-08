import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersKeys } from "../orders/orders.queries";
import { shippingApi } from "./shipping.api";

export function useRescheduleShipment(orderId: string, trackingNumber: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slot: string) => shippingApi.reschedule(trackingNumber, slot),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ordersKeys.detail(orderId),
      });
    },
  });
}
