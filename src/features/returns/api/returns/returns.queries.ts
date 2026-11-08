import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { returnsApi, type CreateReturnBody } from "./returns.api";

export const returnsKeys = {
  mine: ["returns", "mine"] as const,
  detail: (id: string) => ["returns", "detail", id] as const,
  estimate: (orderItemId: string, quantity: number, reasonCode: string) =>
    ["returns", "estimate", orderItemId, quantity, reasonCode] as const,
};

/** The refund a return would give, re-asked as the quantity or reason changes. */
export function useReturnEstimate(
  orderItemId: string | null,
  returnQuantity: number,
  reasonCode: string,
) {
  return useQuery({
    queryKey: returnsKeys.estimate(
      orderItemId ?? "",
      returnQuantity,
      reasonCode,
    ),
    queryFn: () =>
      returnsApi.estimate({
        orderItemId: orderItemId!,
        returnQuantity,
        reasonCode,
      }),
    enabled: Boolean(orderItemId),
    staleTime: 30_000,
  });
}

export function useMyReturns() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: returnsKeys.mine,
    queryFn: () => returnsApi.list(),
    enabled: Boolean(accessToken),
  });
}

export function useReturn(id: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: returnsKeys.detail(id),
    queryFn: () => returnsApi.get(id),
    enabled: Boolean(accessToken && id),
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateReturnBody) => returnsApi.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: returnsKeys.mine });
    },
  });
}

export function useReschedulePickup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; slot: string }) =>
      returnsApi.reschedulePickup(input.id, input.slot),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: returnsKeys.mine });
      void queryClient.invalidateQueries({
        queryKey: returnsKeys.detail(variables.id),
      });
    },
  });
}
