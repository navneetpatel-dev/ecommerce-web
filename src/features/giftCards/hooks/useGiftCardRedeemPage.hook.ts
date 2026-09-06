"use client";

import { useParams } from "next/navigation";
import { useGiftCardByCode } from "../api/giftCards.queries";
import { resolveQueryDetailState } from "@/shared/utils/resolveQueryDetailState";

export function useGiftCardRedeemPage() {
  const params = useParams<{ code: string }>();
  const code = params?.code;
  const query = useGiftCardByCode(code);
  const detail = resolveQueryDetailState(query, { enabled: Boolean(code) });

  return {
    code: code ?? "",
    giftCard: detail.data,
    isLoading: detail.isLoading,
    notFound: detail.isEmpty,
  };
}
