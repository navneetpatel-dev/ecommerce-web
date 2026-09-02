import { useCallback, useRef } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { checkoutApi } from "../../api/checkout.api";
import type { PaymentNotice } from "../usePaymentNotice/index";
import type { CheckoutPaymentPhase } from "../useCheckoutPaymentPhase.hook";

interface UseRestoreCancelledCheckoutOptions {
  showNotice: (notice: PaymentNotice) => void;
  refetchCart: () => Promise<void>;
  onPhaseChange?: (phase: CheckoutPaymentPhase) => void;
  onRestoreComplete?: (orderId: string) => void;
}

type RestoreOptions = {
  /** Skip success/error dialogs (e.g. silent recovery before placing again). */
  silent?: boolean;
};

export function useRestoreCancelledCheckout({
  showNotice,
  refetchCart,
  onPhaseChange,
  onRestoreComplete,
}: UseRestoreCancelledCheckoutOptions) {
  const inFlightRef = useRef<Map<string, Promise<void>>>(new Map());

  const restoreCancelledCheckout = useCallback(
    async (
      orderId: string,
      notice: PaymentNotice | null,
      options?: RestoreOptions,
    ): Promise<void> => {
      const existing = inFlightRef.current.get(orderId);
      if (existing) return existing;

      const promise = (async () => {
        onPhaseChange?.("restoring");
        try {
          await checkoutApi.cancelCheckout({ orderId });
          await refetchCart();
          onRestoreComplete?.(orderId);
          if (notice && !options?.silent) {
            showNotice(notice);
          }
        } catch (err) {
          await refetchCart();
          if (!options?.silent) {
            const description = getApiErrorMessage(
              err,
              notice?.description ?? LABELS.couldNotRestoreCart,
            );
            showNotice({
              variant: "danger",
              title: notice?.title ?? LABELS.couldNotRestoreCartTitle,
              description,
            });
          }
          throw err;
        } finally {
          inFlightRef.current.delete(orderId);
          onPhaseChange?.("idle");
        }
      })();

      inFlightRef.current.set(orderId, promise);
      return promise;
    },
    [showNotice, refetchCart, onPhaseChange, onRestoreComplete],
  );

  const awaitPendingRestores = useCallback(async () => {
    const pending = [...inFlightRef.current.values()];
    if (pending.length > 0) {
      await Promise.all(pending);
    }
  }, []);

  return { restoreCancelledCheckout, awaitPendingRestores };
}
