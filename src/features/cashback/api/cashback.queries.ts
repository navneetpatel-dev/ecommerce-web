import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import {
  cashbackApi,
  type CashbackOfferInput,
  type PageParams,
} from "./cashback.api";

export const cashbackKeys = {
  all: ["cashback"] as const,
  liveOffers: () => [...cashbackKeys.all, "live-offers"] as const,
  history: (params: PageParams) =>
    [...cashbackKeys.all, "history", params] as const,
  admin: () => [...cashbackKeys.all, "admin"] as const,
  adminList: (params: PageParams) =>
    [...cashbackKeys.admin(), "list", params] as const,
};

/** Offers running now; shared by every badge on the page, so one request serves them all. */
export function useLiveCashbackOffers() {
  return useQuery({
    queryKey: cashbackKeys.liveOffers(),
    queryFn: cashbackApi.liveOffers,
    staleTime: 5 * 60_000,
  });
}

export function useCashbackHistory(params: PageParams) {
  const signedIn = useAuthStore((s) => Boolean(s.currentUser));
  return useQuery({
    queryKey: cashbackKeys.history(params),
    queryFn: () => cashbackApi.history(params),
    enabled: signedIn,
    placeholderData: (previous) => previous,
    refetchOnWindowFocus: true,
  });
}

export function useAdminCashbackOffers(params: PageParams) {
  return useQuery({
    queryKey: cashbackKeys.adminList(params),
    queryFn: () => cashbackApi.adminList(params),
    placeholderData: (previous) => previous,
  });
}

/** Create (no id) or edit (id) an offer; every offer list refetches after. */
export function useSaveCashbackOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id?: string; values: CashbackOfferInput }) =>
      input.id
        ? cashbackApi.adminUpdate(input.id, input.values)
        : cashbackApi.adminCreate(input.values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cashbackKeys.all });
    },
  });
}

export function useDeleteCashbackOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cashbackApi.adminDelete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cashbackKeys.all });
    },
  });
}
