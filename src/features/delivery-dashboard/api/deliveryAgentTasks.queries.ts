"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryAgentApi } from "./deliveryAgent.api";
import { deliveryKeys, useDeliveryMutation } from "./deliveryAgent.keys";
import type { DeliveryPickup, DeliveryShipment } from "../types";

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      shipmentId: string;
      status: string;
      note?: string;
      photoUrl?: string;
    }) =>
      deliveryAgentApi.updateDeliveryStatus(input.shipmentId, {
        status: input.status,
        note: input.note,
        photoUrl: input.photoUrl,
      }),
    onMutate: async (input) => {
      queryClient.setQueryData<DeliveryShipment | undefined>(
        deliveryKeys.delivery(input.shipmentId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            status: input.status as DeliveryShipment["status"],
            failureReason:
              input.status === "FAILED"
                ? (input.note ?? old.failureReason)
                : old.failureReason,
          };
        },
      );
      queryClient.setQueriesData<DeliveryShipment[]>(
        { queryKey: ["delivery", "deliveries"] },
        (old) => {
          if (!old || !Array.isArray(old)) return old;
          return old.map((shipment) =>
            shipment.id === input.shipmentId
              ? {
                  ...shipment,
                  status: input.status as DeliveryShipment["status"],
                  failureReason:
                    input.status === "FAILED"
                      ? (input.note ?? shipment.failureReason)
                      : shipment.failureReason,
                }
              : shipment,
          );
        },
      );
    },
    onSettled: () => {
      if (typeof navigator === "undefined" || navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
      }
    },
  });
}
export function useConfirmDelivery() {
  return useDeliveryMutation(
    (input: {
      shipmentId: string;
      otpCode: string;
      proofPhotoUrl?: string;
      codCollected?: boolean;
    }) =>
      deliveryAgentApi.confirmDelivery(input.shipmentId, {
        otpCode: input.otpCode,
        proofPhotoUrl: input.proofPhotoUrl,
        codCollected: input.codCollected,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { returnId: string; note: string }) =>
      deliveryAgentApi.updatePickupStatus(input.returnId, input.note),
    onMutate: async (input) => {
      queryClient.setQueryData<DeliveryPickup | undefined>(
        deliveryKeys.pickup(input.returnId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pickupFailureReason: input.note,
          };
        },
      );
      queryClient.setQueriesData<DeliveryPickup[]>(
        { queryKey: ["delivery", "pickups"] },
        (old) => {
          if (!old || !Array.isArray(old)) return old;
          return old.map((pickup) =>
            pickup.id === input.returnId
              ? { ...pickup, pickupFailureReason: input.note }
              : pickup,
          );
        },
      );
    },
    onSettled: () => {
      if (typeof navigator === "undefined" || navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
      }
    },
  });
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
