"use client";

import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loadRazorpayScript } from "@/features/checkout";
import {
  getRazorpayCheckoutConfig,
  getRazorpayCheckoutMethods,
  getRazorpayCheckoutTheme,
} from "@/features/checkout";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { walletApi } from "../api/wallet.api";
import { walletKeys } from "../api/wallet.queries";

type RechargePhase = "idle" | "opening" | "verifying";

const RECHARGE_IDEMPOTENCY_PREFIX = "wallet-recharge-idempotency:";
const RECHARGE_SESSION_PREFIX = "wallet-recharge-session:";

function getOrCreateIdempotencyKey(amountInr: number): string {
  const storageKey = `${RECHARGE_IDEMPOTENCY_PREFIX}${amountInr}`;
  const existing = sessionStorage.getItem(storageKey);
  if (existing) return existing;
  const key = crypto.randomUUID();
  sessionStorage.setItem(storageKey, key);
  return key;
}

function clearRechargeSession(amountInr: number, rechargeId?: string) {
  sessionStorage.removeItem(`${RECHARGE_IDEMPOTENCY_PREFIX}${amountInr}`);
  if (rechargeId)
    sessionStorage.removeItem(`${RECHARGE_SESSION_PREFIX}${rechargeId}`);
}

async function pollRechargeUntilTerminal(
  rechargeId: string,
  maxAttempts = 12,
  intervalMs = 2500,
): Promise<"PAID" | "FAILED" | "EXPIRED" | "PENDING"> {
  for (let i = 0; i < maxAttempts; i += 1) {
    const row = await walletApi.getRechargeStatus(rechargeId);
    const status = String(row.status ?? "").toUpperCase();
    if (status === "PAID" || status === "FAILED" || status === "EXPIRED") {
      return status as "PAID" | "FAILED" | "EXPIRED";
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return "PENDING";
}

export function useWalletRecharge() {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<RechargePhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const idempotencyRef = useRef<string | null>(null);

  const recharge = useCallback(
    async (amountInr: number) => {
      setError(null);
      setSuccessMessage(null);
      setPhase("opening");

      const idempotencyKey = getOrCreateIdempotencyKey(amountInr);
      idempotencyRef.current = idempotencyKey;

      try {
        const checkout = await walletApi.createRecharge(
          amountInr,
          idempotencyKey,
        );
        sessionStorage.setItem(
          `${RECHARGE_SESSION_PREFIX}${checkout.rechargeId}`,
          String(amountInr),
        );
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
              clearRechargeSession(amountInr, checkout.rechargeId);
              await queryClient.invalidateQueries({ queryKey: walletKeys.all });
              setSuccessMessage(LABELS.walletRechargeSuccess);
            } catch {
              const polled = await pollRechargeUntilTerminal(
                checkout.rechargeId,
              );
              if (polled === "PAID") {
                clearRechargeSession(amountInr, checkout.rechargeId);
                await queryClient.invalidateQueries({
                  queryKey: walletKeys.all,
                });
                setSuccessMessage(LABELS.walletRechargeSuccess);
              } else if (polled === "FAILED" || polled === "EXPIRED") {
                setError(LABELS.paymentFailedBody);
              } else {
                setError(LABELS.paymentConfirmationPendingBody);
              }
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
        setError(getApiErrorMessage(err, LABELS.paymentFailedBody));
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
