import { useRef } from "react";
import { checkoutApi } from "../../api/checkout.api";
import type { PaymentNotice } from "../usePaymentNotice/index";

interface UseRestoreCancelledCheckoutOptions {
  showNotice: (notice: PaymentNotice) => void;
  clearCartCache: () => void;
}

export function useRestoreCancelledCheckout({
  showNotice,
  clearCartCache,
}: UseRestoreCancelledCheckoutOptions) {
  const cancelInFlightRef = useRef<Set<string>>(new Set());

  const restoreCancelledCheckout = async (
    orderId: string,
    notice: PaymentNotice,
  ) => {
    if (cancelInFlightRef.current.has(orderId)) return;
    cancelInFlightRef.current.add(orderId);

    try {
      await checkoutApi.cancelCheckout({ orderId });
      clearCartCache();
      showNotice(notice);
    } catch (err) {
      const description =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : notice.description;
      showNotice({
        variant: "danger",
        title: notice.title,
        description,
      });
      clearCartCache();
    }
  };

  return restoreCancelledCheckout;
}
