import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";
import type { WalletRechargePreviewResponse } from "../api/wallet.api";

export type WalletRechargeValidationCode =
  WalletRechargePreviewResponse["validationCode"];

export type WalletRechargeLimits = {
  minInr: number;
  maxInr: number;
  maxBalance: number;
};

export function walletRechargeValidationLabel(
  code: WalletRechargeValidationCode | null | undefined,
  limits: WalletRechargeLimits | undefined,
): string | null {
  if (!code || code === "ok" || !limits) return null;
  if (code === "below-min") {
    return formatLabel(LABELS.walletRechargeBelowMin, {
      min: formatInr(limits.minInr),
    });
  }
  if (code === "above-max") {
    return formatLabel(LABELS.walletRechargeAboveMax, {
      max: formatInr(limits.maxInr),
    });
  }
  if (code === "max-balance") {
    return formatLabel(LABELS.walletMaxBalanceReached, {
      cap: formatPoints(limits.maxBalance),
    });
  }
  return null;
}
