import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersKeys } from "../orders/orders.queries";
import { shippingApi } from "./shipping.api";

export const shippingKeys = {
  rating: (shipmentId: string) => ["delivery-rating", shipmentId] as const,
};

export function useDeliveryRating(shipmentId: string) {
  return useQuery({
    queryKey: shippingKeys.rating(shipmentId),
    queryFn: () => shippingApi.getRating(shipmentId),
  });
}

export function useSubmitDeliveryRating(shipmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { rating: number; comment?: string }) =>
      shippingApi.submitRating(shipmentId, input.rating, input.comment),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: shippingKeys.rating(shipmentId),
      });
    },
  });
}

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
