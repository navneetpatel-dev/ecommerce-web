"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { walletApi } from "../api/wallet.api";
import { walletKeys } from "../api/wallet.queries";

const PREVIEW_DEBOUNCE_MS = 300;

export function useWalletRechargePreview(amountInr: number | undefined) {
  const [debouncedAmount, setDebouncedAmount] = useState<number | undefined>();

  useEffect(() => {
    if (amountInr == null || !Number.isFinite(amountInr) || amountInr <= 0) {
      setDebouncedAmount(undefined);
      return;
    }
    const handle = window.setTimeout(() => setDebouncedAmount(amountInr), PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [amountInr]);

  return useQuery({
    queryKey: walletKeys.rechargePreview(debouncedAmount ?? 0),
    queryFn: () => walletApi.previewRecharge(debouncedAmount!),
    enabled: debouncedAmount != null && debouncedAmount > 0,
    staleTime: 30_000,
  });
}
