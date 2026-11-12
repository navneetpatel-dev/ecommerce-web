import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { nextPageOf } from "@/shared/api/client/pagination";
import {
  giftCardsApi,
  type AdminGiftCardListParams,
  type MyGiftCardsSide,
} from "./giftCards.api";

export const giftCardsKeys = {
  all: ["gift-cards"] as const,
  byCode: (code: string) => [...giftCardsKeys.all, "code", code] as const,
  mine: () => [...giftCardsKeys.all, "mine"] as const,
  admin: () => [...giftCardsKeys.all, "admin"] as const,
  adminList: (params: AdminGiftCardListParams) =>
    [...giftCardsKeys.admin(), "list", params] as const,
  liability: () => [...giftCardsKeys.admin(), "liability"] as const,
};

export function useGiftCardByCode(code: string | undefined) {
  return useQuery({
    queryKey: giftCardsKeys.byCode(code ?? ""),
    queryFn: () => giftCardsApi.getByCode(code!),
    enabled: Boolean(code),
    retry: false,
  });
}

export function useMyGiftCards(side: MyGiftCardsSide) {
  return useInfiniteQuery({
    queryKey: [...giftCardsKeys.mine(), side],
    queryFn: ({ pageParam }) => giftCardsApi.mine(side, pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
  });
}

export function useResendGiftCard() {
  return useMutation({ mutationFn: (id: string) => giftCardsApi.resend(id) });
}

export function useAdminGiftCards(params: AdminGiftCardListParams) {
  return useQuery({
    queryKey: giftCardsKeys.adminList(params),
    queryFn: () => giftCardsApi.adminList(params),
    placeholderData: (previous) => previous,
  });
}

export function useGiftCardLiability() {
  return useQuery({
    queryKey: giftCardsKeys.liability(),
    queryFn: giftCardsApi.adminLiability,
  });
}

export function useCancelGiftCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; reason: string }) =>
      giftCardsApi.adminCancel(input.id, input.reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: giftCardsKeys.admin() });
    },
  });
}
