"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deliveryAgentApi } from "./deliveryAgent.api";

export const deliveryKeys = {
  all: ["delivery"] as const,
  profile: ["delivery", "profile"] as const,
  deliveries: (statuses?: string[]) =>
    ["delivery", "deliveries", statuses ?? []] as const,
  pickups: (statuses?: string[]) =>
    ["delivery", "pickups", statuses ?? []] as const,
};

export function useDeliveryProfile() {
  return useQuery({
    queryKey: deliveryKeys.profile,
    queryFn: deliveryAgentApi.profile,
  });
}
export function useMyDeliveries(statuses?: string[]) {
  return useQuery({
    queryKey: deliveryKeys.deliveries(statuses),
    queryFn: () => deliveryAgentApi.myDeliveries(statuses),
  });
}
export function useMyPickups(statuses?: string[]) {
  return useQuery({
    queryKey: deliveryKeys.pickups(statuses),
    queryFn: () => deliveryAgentApi.myPickups(statuses),
  });
}
function useDeliveryMutation<T>(mutationFn: (value: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}
export function useUpdateDeliveryStatus() {
  return useDeliveryMutation(
    (input: { shipmentId: string; status: string; note?: string }) =>
      deliveryAgentApi.updateDeliveryStatus(input.shipmentId, {
        status: input.status,
        note: input.note,
      }),
  );
}
export function useConfirmDelivery() {
  return useDeliveryMutation(
    (input: { shipmentId: string; otpCode: string; proofPhotoUrl?: string }) =>
      deliveryAgentApi.confirmDelivery(input.shipmentId, {
        otpCode: input.otpCode,
        proofPhotoUrl: input.proofPhotoUrl,
      }),
  );
}
export function useRequestDeliveryCode() {
  return useMutation({
    mutationFn: (shipmentId: string) =>
      deliveryAgentApi.requestDeliveryCode(shipmentId),
  });
}
export function useUpdatePickupStatus() {
  return useDeliveryMutation((input: { returnId: string; note: string }) =>
    deliveryAgentApi.updatePickupStatus(input.returnId, input.note),
  );
}
export function useRequestPickupCode() {
  return useMutation({
    mutationFn: (returnId: string) =>
      deliveryAgentApi.requestPickupCode(returnId),
  });
}
export function useConfirmPickup() {
  return useDeliveryMutation(
    (input: {
      returnId: string;
      otpCode: string;
      itemConditionPhotoUrls?: string[];
      replacementProofUrl?: string;
    }) => deliveryAgentApi.confirmPickup(input.returnId, input),
  );
}
export function useSetAvailability() {
  return useDeliveryMutation((available: boolean) =>
    deliveryAgentApi.setAvailability(available),
  );
}
