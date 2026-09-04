"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deliveryAgentApi } from "./deliveryAgent.api";
import type { BankDetails, DeliveryAgentDocumentType } from "../types";

export const deliveryKeys = {
  all: ["delivery"] as const,
  profile: ["delivery", "profile"] as const,
  deliveries: (statuses?: string[]) =>
    ["delivery", "deliveries", statuses ?? []] as const,
  delivery: (shipmentId: string) =>
    ["delivery", "delivery", shipmentId] as const,
  pickups: (statuses?: string[]) =>
    ["delivery", "pickups", statuses ?? []] as const,
  pickup: (returnId: string) => ["delivery", "pickup", returnId] as const,
  shiftSummary: ["delivery", "shift-summary"] as const,
  cashDeposits: ["delivery", "cash-deposits"] as const,
  payouts: ["delivery", "payouts"] as const,
  earnings: ["delivery", "earnings"] as const,
  documents: ["delivery", "documents"] as const,
};

export function useDeliveryProfile() {
  return useQuery({
    queryKey: deliveryKeys.profile,
    queryFn: deliveryAgentApi.profile,
  });
}
/** Admin can assign a new task while this is open — poll so it shows up without a manual refresh. */
const TASK_LIST_REFETCH_INTERVAL_MS = 30_000;

export function useMyDeliveries(statuses?: string[]) {
  return useQuery({
    queryKey: deliveryKeys.deliveries(statuses),
    queryFn: () => deliveryAgentApi.myDeliveries(statuses),
    refetchInterval: TASK_LIST_REFETCH_INTERVAL_MS,
  });
}
export function useMyPickups(statuses?: string[]) {
  return useQuery({
    queryKey: deliveryKeys.pickups(statuses),
    queryFn: () => deliveryAgentApi.myPickups(statuses),
    refetchInterval: TASK_LIST_REFETCH_INTERVAL_MS,
  });
}
/** Backs the task detail pages directly — no more loading the whole list to find one. */
export function useDelivery(shipmentId: string) {
  return useQuery({
    queryKey: deliveryKeys.delivery(shipmentId),
    queryFn: () => deliveryAgentApi.delivery(shipmentId),
    enabled: Boolean(shipmentId),
    refetchInterval: TASK_LIST_REFETCH_INTERVAL_MS,
  });
}
export function usePickup(returnId: string) {
  return useQuery({
    queryKey: deliveryKeys.pickup(returnId),
    queryFn: () => deliveryAgentApi.pickup(returnId),
    enabled: Boolean(returnId),
    refetchInterval: TASK_LIST_REFETCH_INTERVAL_MS,
  });
}
export function useShiftSummary() {
  return useQuery({
    queryKey: deliveryKeys.shiftSummary,
    queryFn: () => deliveryAgentApi.shiftSummary(),
    refetchInterval: TASK_LIST_REFETCH_INTERVAL_MS,
  });
}
export function useUpdateLocation() {
  return useMutation({
    mutationFn: (input: { lat: number; lng: number }) =>
      deliveryAgentApi.updateLocation(input.lat, input.lng),
  });
}
export function useMyCashDeposits() {
  return useQuery({
    queryKey: deliveryKeys.cashDeposits,
    queryFn: () => deliveryAgentApi.myCashDeposits(),
  });
}
export function useCloseCashShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { amount: number; note?: string }) =>
      deliveryAgentApi.closeCashShift(input.amount, input.note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.shiftSummary });
      queryClient.invalidateQueries({ queryKey: deliveryKeys.cashDeposits });
    },
  });
}
export function useRequestRtoHandoverCode() {
  return useMutation({
    mutationFn: (shipmentId: string) =>
      deliveryAgentApi.requestRtoHandoverCode(shipmentId),
  });
}
export function useConfirmRtoHandover() {
  return useDeliveryMutation((input: { shipmentId: string; otpCode: string }) =>
    deliveryAgentApi.confirmRtoHandover(input.shipmentId, input.otpCode),
  );
}
export function useMyPayouts() {
  return useQuery({
    queryKey: deliveryKeys.payouts,
    queryFn: () => deliveryAgentApi.myPayouts(),
  });
}
export function useMyEarningsLedger() {
  return useQuery({
    queryKey: deliveryKeys.earnings,
    queryFn: () => deliveryAgentApi.myEarningsLedger(),
  });
}
export function useUpdateBankDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bankDetails: BankDetails) =>
      deliveryAgentApi.updateBankDetails(bankDetails),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: deliveryKeys.profile }),
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
    (input: {
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
  );
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
export function useMyDocuments() {
  return useQuery({
    queryKey: deliveryKeys.documents,
    queryFn: () => deliveryAgentApi.myDocuments(),
  });
}
export function useSubmitDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      type: DeliveryAgentDocumentType;
      url: string;
      expiryDate?: string;
    }) =>
      deliveryAgentApi.submitDocument(input.type, input.url, input.expiryDate),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: deliveryKeys.documents }),
  });
}
