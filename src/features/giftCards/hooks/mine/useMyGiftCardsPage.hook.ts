"use client";

import { useCallback } from "react";
import { LABELS } from "@/shared/constants/labels";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { GiftCardView } from "../../api/gift-cards/giftCards.api";
import {
  useMyGiftCards,
  useResendGiftCard,
} from "../../api/gift-cards/giftCards.queries";

/** The customer's sent and redeemed gift cards, and emailing a sent one again. */
export function useMyGiftCardsPage() {
  const query = useMyGiftCards();
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

  return {
    purchased: query.data?.purchased ?? [],
    redeemed: query.data?.redeemed ?? [],
    loading: query.isLoading,
    error: query.error
      ? getApiErrorMessage(query.error, LABELS.genericActionFailed)
      : null,
    resendingId: resend.isPending ? (resend.variables ?? null) : null,
    handleResend,
  };
}
