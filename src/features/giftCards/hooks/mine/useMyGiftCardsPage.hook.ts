"use client";

import { useCallback } from "react";
import { LABELS } from "@/shared/constants/labels";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { flattenPages } from "@/shared/api/client/pagination";
import type { GiftCardView } from "../../api/gift-cards/giftCards.api";
import {
  useMyGiftCards,
  useResendGiftCard,
} from "../../api/gift-cards/giftCards.queries";

/** The customer's sent and redeemed gift cards, and emailing a sent one again. */
export function useMyGiftCardsPage() {
  const purchasedQuery = useMyGiftCards("purchased");
  const redeemedQuery = useMyGiftCards("redeemed");
  const resend = useResendGiftCard();

  const handleResend = useCallback(
    (card: GiftCardView) => {
      resend.mutate(card.id, {
        onSuccess: () =>
          notifySuccess(
            formatLabel(LABELS.giftCardResent, { email: card.recipientEmail }),
          ),
        onError: (error) =>
          notifyError(getApiErrorMessage(error, LABELS.giftCardResendFailed)),
      });
    },
    [resend],
  );

  const loadMorePurchased = useCallback(
    () => void purchasedQuery.fetchNextPage(),
    [purchasedQuery],
  );
  const loadMoreRedeemed = useCallback(
    () => void redeemedQuery.fetchNextPage(),
    [redeemedQuery],
  );
  const firstError = purchasedQuery.error ?? redeemedQuery.error;

  return {
    purchased: flattenPages(purchasedQuery.data),
    redeemed: flattenPages(redeemedQuery.data),
    loading: purchasedQuery.isLoading,
    redeemedLoading: redeemedQuery.isLoading,
    purchasedPaging: {
      hasNextPage: purchasedQuery.hasNextPage,
      isFetchingNextPage: purchasedQuery.isFetchingNextPage,
      onLoadMore: loadMorePurchased,
    },
    redeemedPaging: {
      hasNextPage: redeemedQuery.hasNextPage,
      isFetchingNextPage: redeemedQuery.isFetchingNextPage,
      onLoadMore: loadMoreRedeemed,
    },
    error: firstError
      ? getApiErrorMessage(firstError, LABELS.genericActionFailed)
      : null,
    resendingId: resend.isPending ? (resend.variables ?? null) : null,
    handleResend,
  };
}
