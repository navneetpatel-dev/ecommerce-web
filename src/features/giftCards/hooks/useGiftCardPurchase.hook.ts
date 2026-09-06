"use client";

import { useCallback, useState } from "react";
import {
  loadRazorpayScript,
  getRazorpayCheckoutConfig,
  getRazorpayCheckoutMethods,
  getRazorpayCheckoutTheme,
} from "@/features/checkout";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  giftCardsApi,
  type PurchaseGiftCardPayload,
} from "../api/giftCards.api";

type PurchasePhase = "idle" | "opening" | "verifying";

export function useGiftCardPurchase() {
  const [phase, setPhase] = useState<PurchasePhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [successAmount, setSuccessAmount] = useState<number | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const purchase = useCallback(async (payload: PurchaseGiftCardPayload) => {
    setError(null);
    setSuccessAmount(null);
    setSuccessEmail(null);
    setPhase("opening");

    try {
      const checkout = await giftCardsApi.purchase(payload);
      await loadRazorpayScript();
      if (!window.Razorpay) {
        throw new Error("Payment could not start. Please try again.");
      }

      const theme = getRazorpayCheckoutTheme();
      const rzp = new window.Razorpay({
        key: checkout.keyId,
        order_id: checkout.razorpayOrderId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "Gift Card",
        description: `Gift card for ${payload.recipientEmail}`,
        theme,
        method: getRazorpayCheckoutMethods(),
        config: getRazorpayCheckoutConfig(),
        ...(checkout.checkoutConfigId
          ? { checkout_config_id: checkout.checkoutConfigId }
          : {}),
        modal: {
          backdropclose: true,
          escape: true,
          ondismiss: () => setPhase("idle"),
        },
        handler: async (response) => {
          setPhase("verifying");
          try {
            await giftCardsApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              giftCardId: checkout.giftCardId,
            });
            setSuccessAmount(payload.amount);
            setSuccessEmail(payload.recipientEmail);
          } catch (err) {
            setError(
              getApiErrorMessage(
                err,
                "Payment succeeded but confirmation is taking longer than expected. We'll email the gift card once it's confirmed.",
              ),
            );
          } finally {
            setPhase("idle");
          }
        },
      });

      rzp.on("payment.failed", (resp) => {
        setPhase("idle");
        setError(
          resp.error?.description || "Payment failed. Please try again.",
        );
      });

      rzp.open();
    } catch (err) {
      setPhase("idle");
      setError(
        getApiErrorMessage(err, "Something went wrong. Please try again."),
      );
    }
  }, []);

  return {
    purchase,
    phase,
    isBusy: phase !== "idle",
    error,
    successAmount,
    successEmail,
    reset: () => {
      setError(null);
      setSuccessAmount(null);
      setSuccessEmail(null);
    },
  };
}
