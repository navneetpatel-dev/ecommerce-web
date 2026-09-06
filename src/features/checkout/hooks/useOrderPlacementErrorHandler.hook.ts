import { useCallback } from "react";
import { ApiError } from "@/shared/types/apiError.types";
import { ERROR_CODES } from "@/shared/constants/errors";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { PaymentNotice } from "./usePaymentNotice/index";

const CART_EMPTY_MESSAGE = "Cart is empty";

function isCartEmptyError(err: unknown): boolean {
  return (
    err instanceof ApiError &&
    err.code === ERROR_CODES.VALIDATION_ERROR &&
    err.message === CART_EMPTY_MESSAGE
  );
}

interface UseOrderPlacementErrorHandlerOptions {
  showNotice: (notice: PaymentNotice) => void;
  restoreCancelledCheckout: (
    orderId: string,
    notice: PaymentNotice | null,
    options?: { silent?: boolean },
  ) => Promise<void>;
  clearCartCache: () => void;
}

/** Failure branch of place-order: cart-empty recovery vs. a plain error notice (Rule 3). */
export function useOrderPlacementErrorHandler({
  showNotice,
  restoreCancelledCheckout,
  clearCartCache,
}: UseOrderPlacementErrorHandlerOptions) {
  return useCallback(
    async (err: unknown, pendingOrderId: string | null) => {
      if (isCartEmptyError(err) && pendingOrderId) {
        try {
          await restoreCancelledCheckout(pendingOrderId, {
            variant: "info",
            title: LABELS.cartEmptyCheckoutTitle,
            description: LABELS.cartEmptyCheckoutBody,
          });
        } catch {
          showNotice({
            variant: "danger",
            title: LABELS.placeOrderFailedTitle,
            description: LABELS.placeOrderFailedBody,
          });
        }
        return;
      }

      const isItemsUnavailable =
        err instanceof ApiError && err.code === ERROR_CODES.ITEMS_UNAVAILABLE;
      const description = isItemsUnavailable
        ? LABELS.removeUnavailableToCheckout
        : getApiErrorMessage(err, LABELS.placeOrderFailedBody);
      showNotice({
        variant: isItemsUnavailable ? "warning" : "danger",
        title: isItemsUnavailable
          ? LABELS.itemsUnavailableTitle
          : LABELS.placeOrderFailedTitle,
        description,
      });
      if (isItemsUnavailable) {
        clearCartCache();
      }
    },
    [showNotice, restoreCancelledCheckout, clearCartCache],
  );
}
