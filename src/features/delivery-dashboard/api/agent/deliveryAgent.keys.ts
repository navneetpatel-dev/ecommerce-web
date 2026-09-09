"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Query-key factory and shared mutation base, kept in their own module (no
 * dependency on any sibling `.queries.ts` file) so `deliveryAgent.queries.ts`
 * and its split-out siblings (`deliveryAgentTasks`/`deliveryAgentPayouts`/
 * `deliveryAgentDocuments`.queries.ts) can all import from here without a
 * circular module dependency between them.
 */
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
  ratings: ["delivery", "ratings"] as const,
};

/** Shared by mutations that just invalidate everything delivery-related on success. */
export function useDeliveryMutation<T>(
  mutationFn: (value: T) => Promise<unknown>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}
