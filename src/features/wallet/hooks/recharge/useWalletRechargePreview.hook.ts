"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { walletApi } from "../../api/wallet/wallet.api";
import { walletKeys } from "../../api/wallet/wallet.queries";

const PREVIEW_DEBOUNCE_MS = 300;

function isValidAmount(amountInr: number | undefined): amountInr is number {
  return amountInr != null && Number.isFinite(amountInr) && amountInr > 0;
}

export function useWalletRechargePreview(amountInr: number | undefined) {
  const debouncedAmount = useDebouncedValue(amountInr, PREVIEW_DEBOUNCE_MS);

  // Disable immediately when the current (not-yet-debounced) amount becomes
  // invalid, rather than waiting out the debounce window — matches the
  // original setTimeout-based implementation's asymmetric reset behavior.
  const enabled = isValidAmount(amountInr) && isValidAmount(debouncedAmount);

  return useQuery({
    queryKey: walletKeys.rechargePreview(debouncedAmount ?? 0),
    queryFn: () => walletApi.previewRecharge(debouncedAmount!),
    enabled,
    staleTime: 30_000,
  });
}
