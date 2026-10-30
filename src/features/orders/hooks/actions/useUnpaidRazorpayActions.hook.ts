"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/features/cart";
import {
  checkoutApi,
  launchRazorpayPayment,
  type PaymentNotice,
} from "@/features/checkout";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { ERROR_CODES } from "@/shared/constants/http/errors";
import { isApiErrorCode } from "@/shared/types/apiError.types";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { Order } from "@/shared/api/types";
import { ordersKeys } from "../../api/orders/orders.queries";
import { canResumeRazorpayPayment } from "../../utils/actions/unpaidRazorpay.utils";

export function useUnpaidRazorpayActions(order: Order) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [notice, setNotice] = useState<PaymentNotice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canResume = canResumeRazorpayPayment(order);

  const refreshOrders = () => {
    void queryClient.invalidateQueries({ queryKey: ordersKeys.all });
  };

  const payNow = async () => {
    setError(null);
    setNotice(null);
    setPaying(true);
    try {
      const result = await checkoutApi.resumePayment({ orderId: order.id });
      await launchRazorpayPayment(result, {
        router,
        showNotice: setNotice,
        clearCartCache: () => {
          void queryClient.invalidateQueries({ queryKey: cartKeys.all });
        },
        onOrderPlaced: refreshOrders,
        restoreCancelledCheckout: async () => {},
        keepOrderOnDismiss: true,
      });
    } catch (err) {
      if (isApiErrorCode(err, ERROR_CODES.CHECKOUT_PAID_CANNOT_CANCEL)) {
        refreshOrders();
        setNotice({
          variant: "info",
          title: LABELS.paymentAlreadyConfirmed,
          description: "",
        });
        return;
      }
      setError(getApiErrorMessage(err, LABELS.paymentUnavailableTitle));
    } finally {
      setPaying(false);
    }
  };

  const confirmCancel = async () => {
    setError(null);
    setNotice(null);
    setCancelling(true);
    try {
      await checkoutApi.cancelCheckout({ orderId: order.id });
      void queryClient.invalidateQueries({ queryKey: cartKeys.all });
      refreshOrders();
      setOpen(false);
      router.push(PATHS.cart);
    } catch (err) {
      if (isApiErrorCode(err, ERROR_CODES.CHECKOUT_PAID_CANNOT_CANCEL)) {
        refreshOrders();
        setOpen(false);
        setNotice({
          variant: "info",
          title: LABELS.paymentAlreadyConfirmed,
          description: "",
        });
        return;
      }
      setError(getApiErrorMessage(err, LABELS.orderCancelFailed));
    } finally {
      setCancelling(false);
    }
  };

  return {
    canResume,
    open,
    setOpen,
    paying,
    cancelling,
    notice,
    error,
    payNow,
    confirmCancel,
  };
}
