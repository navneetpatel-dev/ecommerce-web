import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { nextPageOf } from "@/shared/api/client/pagination";
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
  return useInfiniteQuery({
    queryKey: returnsKeys.mine,
    queryFn: ({ pageParam }) => returnsApi.list(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
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

export function useCancelReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => returnsApi.cancel(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: returnsKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: returnsKeys.mine });
      // The order's line can be returned again.
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
