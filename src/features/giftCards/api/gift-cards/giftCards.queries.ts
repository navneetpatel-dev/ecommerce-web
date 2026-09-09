import { useQuery } from "@tanstack/react-query";
import { giftCardsApi } from "./giftCards.api";

export const giftCardsKeys = {
  all: ["gift-cards"] as const,
  byCode: (code: string) => [...giftCardsKeys.all, "code", code] as const,
};

export function useGiftCardByCode(code: string | undefined) {
  return useQuery({
    queryKey: giftCardsKeys.byCode(code ?? ""),
    queryFn: () => giftCardsApi.getByCode(code!),
    enabled: Boolean(code),
    retry: false,
  });
}
