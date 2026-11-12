import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersKeys } from "../orders/orders.queries";
import type { RedeliveryChoice } from "@/shared/utils/orders/redeliveryOptions";
import { shippingApi } from "./shipping.api";

export function useRescheduleShipment(orderId: string, trackingNumber: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (choice: RedeliveryChoice) =>
      shippingApi.reschedule(trackingNumber, choice),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ordersKeys.detail(orderId),
      });
    },
  });
}
