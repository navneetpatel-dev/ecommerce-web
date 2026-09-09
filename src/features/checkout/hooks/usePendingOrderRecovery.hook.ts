import { useCallback, useRef } from "react";
import type { PaymentNotice } from "./usePaymentNotice/index";

type RestoreCancelledCheckoutFn = (
  orderId: string,
  notice: PaymentNotice | null,
  options?: { silent?: boolean },
) => Promise<void>;

export function usePendingOrderRecovery(
  restoreCancelledCheckout: RestoreCancelledCheckoutFn,
) {
  const pendingOrderIdRef = useRef<string | null>(null);

  const clearPendingOrder = useCallback((orderId?: string) => {
    if (!orderId || pendingOrderIdRef.current === orderId) {
      pendingOrderIdRef.current = null;
    }
  }, []);

  const recoverPendingCheckout = useCallback(
    async (options?: { silent?: boolean }) => {
      const orderId = pendingOrderIdRef.current;
      if (!orderId) return;
      await restoreCancelledCheckout(orderId, null, options);
    },
    [restoreCancelledCheckout],
  );

  return {
    pendingOrderIdRef,
    clearPendingOrder,
    recoverPendingCheckout,
  };
}
