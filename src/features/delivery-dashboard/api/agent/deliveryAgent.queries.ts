"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { deliveryAgentApi } from "./deliveryAgent.api";
import { deliveryKeys, useDeliveryMutation } from "./deliveryAgent.keys";

export { deliveryKeys, useDeliveryMutation } from "./deliveryAgent.keys";

export function useDeliveryProfile() {
  return useQuery({
    queryKey: deliveryKeys.profile,
    queryFn: deliveryAgentApi.profile,
  });
}

export function useMyRatingsQuery() {
  return useQuery({
    queryKey: deliveryKeys.ratings,
    queryFn: deliveryAgentApi.myRatings,
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
// Payout/earnings/cash-deposit, document, and task-action (status
// update/confirm/request-code) hooks live in sibling files, split out to
// stay under the per-file line ceiling and re-exported below so existing
// "../api/deliveryAgent.queries" import sites keep working unchanged.
export {
  useMyCashDeposits,
  useCloseCashShift,
  useMyPayouts,
  useMyEarningsLedger,
  useUpdateBankDetails,
} from "../earnings/deliveryAgentPayouts.queries";
export {
  useMyDocuments,
  useSubmitDocument,
} from "../documents/deliveryAgentDocuments.queries";
export {
  useUpdateDeliveryStatus,
  useConfirmDelivery,
  useRequestDeliveryCode,
  useUpdatePickupStatus,
  useRequestPickupCode,
  useConfirmPickup,
  useSetAvailability,
} from "../deliveries/deliveryAgentTasks.queries";
