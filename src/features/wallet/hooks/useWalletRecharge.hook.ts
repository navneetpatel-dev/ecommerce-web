"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loadRazorpayScript } from "@/features/checkout/utils/loadRazorpayScript";
import {
  getRazorpayCheckoutConfig,
  getRazorpayCheckoutMethods,
} from "@/features/checkout/utils/razorpayCheckoutConfig";
import { getRazorpayCheckoutTheme } from "@/features/checkout/utils/razorpayTheme";
import { LABELS } from "@/shared/constants/labels";
import { walletApi } from "../api/wallet.api";
import { walletKeys } from "../api/wallet.queries";

type RechargePhase = "idle" | "opening" | "verifying";

export function useWalletRecharge() {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<RechargePhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const recharge = useCallback(
    async (amountInr: number) => {
      setError(null);
      setSuccessMessage(null);
      setPhase("opening");

      try {
        const checkout = await walletApi.createRecharge(amountInr);
        await loadRazorpayScript();
        if (!window.Razorpay) {
          throw new Error(LABELS.paymentUnavailableLoadScript);
        }

        const theme = getRazorpayCheckoutTheme();
        const rzp = new window.Razorpay({
          key: checkout.keyId,
          order_id: checkout.razorpayOrderId,
          amount: checkout.amount,
          currency: checkout.currency,
          name: LABELS.brandName,
          description: LABELS.walletRecharge,
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
              await walletApi.verifyRecharge({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                rechargeId: checkout.rechargeId,
              });
              await queryClient.invalidateQueries({ queryKey: walletKeys.all });
              setSuccessMessage(LABELS.walletRechargeSuccess);
            } catch {
              setError(LABELS.paymentConfirmationPendingBody);
            } finally {
              setPhase("idle");
            }
          },
        });

        rzp.on("payment.failed", (resp) => {
          setPhase("idle");
          setError(resp.error?.description || LABELS.paymentFailedBody);
        });

        rzp.open();
      } catch (err) {
        setPhase("idle");
        setError(err instanceof Error ? err.message : LABELS.paymentFailedBody);
      }
    },
    [queryClient],
  );

  return {
    recharge,
    phase,
    isBusy: phase !== "idle",
    error,
    successMessage,
    clearMessages: () => {
      setError(null);
      setSuccessMessage(null);
    },
  };
}
