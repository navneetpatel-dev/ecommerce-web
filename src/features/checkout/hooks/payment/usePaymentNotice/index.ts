import { useCallback, useState } from "react";
import type { StatusDialogVariant } from "@/shared/components/StatusDialog.component";

export type PaymentNotice = {
  variant: StatusDialogVariant;
  title: string;
  description: string;
};

export function usePaymentNotice() {
  const [paymentNotice, setPaymentNotice] = useState<PaymentNotice | null>(
    null,
  );

  const showNotice = useCallback((notice: PaymentNotice) => {
    setPaymentNotice(notice);
  }, []);

  const resetNotice = useCallback(() => {
    setPaymentNotice(null);
  }, []);

  const clearPaymentNotice = useCallback(() => {
    setPaymentNotice(null);
  }, []);

  return { paymentNotice, showNotice, resetNotice, clearPaymentNotice };
}
