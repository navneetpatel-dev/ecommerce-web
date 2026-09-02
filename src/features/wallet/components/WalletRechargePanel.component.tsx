"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";
import { useWalletRecharge } from "../hooks/useWalletRecharge.hook";
import { useWalletRechargePreview } from "../hooks/useWalletRechargePreview.hook";
import {
  walletRechargeValidationLabel,
  type WalletRechargeValidationCode,
} from "../utils/walletRechargeValidation";
import { walletApi } from "../api/wallet.api";
import { walletKeys } from "../api/wallet.queries";
import type { WalletBalanceResponse } from "../api/wallet.api";
import { cn } from "@/shared/utils/cn";
import { WalletRechargePanelSkeleton } from "./WalletSectionSkeletons.component";

interface WalletRechargePanelProps {
  balance: WalletBalanceResponse | undefined;
  isLoading?: boolean;
  className?: string;
}

export function WalletRechargePanel({
  balance,
  isLoading,
  className,
}: WalletRechargePanelProps) {
  const { recharge, isBusy, error, successMessage, clearMessages } =
    useWalletRecharge();
  const [customAmount, setCustomAmount] = useState<number | undefined>();

  const limits = balance?.limits;
  const presets = limits?.presetsInr ?? [];
  const rechargeEnabled = balance?.rechargeEnabled !== false;
  const pointsPerRupee = limits?.pointsPerRupee ?? 1;

  const customPreviewQuery = useWalletRechargePreview(customAmount);
  const presetPreviewQueries = useQueries({
    queries: presets.map((preset) => ({
      queryKey: walletKeys.rechargePreview(preset),
      queryFn: () => walletApi.previewRecharge(preset),
      enabled: rechargeEnabled && preset > 0,
      staleTime: 30_000,
    })),
  });

  const customValidationCode = customPreviewQuery.data?.validationCode ?? null;

  const amountError = useMemo(
    () => walletRechargeValidationLabel(customValidationCode, limits),
    [customValidationCode, limits],
  );

  const canSubmitCustomAmount =
    customAmount != null &&
    customAmount > 0 &&
    customValidationCode === "ok" &&
    !customPreviewQuery.isFetching;

  if (isLoading) {
    return <WalletRechargePanelSkeleton className={className} />;
  }

  if (!rechargeEnabled) return null;

  const validationMessage = (
    code: WalletRechargeValidationCode | null | undefined,
  ): string | null => walletRechargeValidationLabel(code, limits);

  const startRecharge = async (amount: number) => {
    clearMessages();
    const preview = await walletApi.previewRecharge(amount);
    const message = validationMessage(preview.validationCode);
    if (message) return;
    await recharge(amount);
  };

  return (
    <div
      className={cn(
        "border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6",
        className,
      )}
    >
      <h2 className="text-body font-semibold text-ink">{LABELS.walletRecharge}</h2>
      <p className="mt-1 text-[0.875rem] text-ink-muted">
        {LABELS.walletPointsEqualsInr}
      </p>
      {limits?.maxBalance ? (
        <p className="mt-2 text-[0.75rem] leading-relaxed text-ink-faint">
          {formatLabel(LABELS.walletMaxBalanceCapNote, {
            cap: formatPoints(limits.maxBalance),
          })}
        </p>
      ) : null}

      {presets.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {presets.map((preset, index) => {
            const preview = presetPreviewQueries[index]?.data;
            return (
              <Button
                key={preset}
                type="button"
                variant="outline"
                size="sm"
                disabled={isBusy}
                className="h-auto min-h-9 justify-start px-3 py-2"
                onClick={() => void startRecharge(preset)}
              >
                <span className="flex flex-col items-start leading-tight">
                  <span>{formatInr(preset)}</span>
                  {pointsPerRupee > 1 && preview?.validationCode === "ok" ? (
                    <span className="text-[0.6875rem] text-ink-muted">
                      {formatLabel(LABELS.walletRechargeBonusHint, {
                        amount: formatInr(preset),
                        points: formatPoints(preview.pointsToCredit),
                      })}
                    </span>
                  ) : null}
                </span>
              </Button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        <FormFieldFrame
          label={LABELS.walletRechargeCustomAmount}
          htmlFor="wallet-recharge-amount"
          error={amountError ?? undefined}
          hint={
            limits
              ? formatLabel(LABELS.walletRechargeLimitsHint, {
                  min: formatInr(limits.minInr),
                  max: formatInr(limits.maxInr),
                })
              : undefined
          }
        >
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <NumberInput
              id="wallet-recharge-amount"
              value={customAmount}
              min={limits?.minInr}
              max={limits?.maxInr}
              step={50}
              prefix="₹"
              disabled={isBusy}
              showSteppers={false}
              error={Boolean(amountError)}
              onChange={(value) => {
                setCustomAmount(value);
                clearMessages();
              }}
            />
            <Button
              type="button"
              fullWidth="mobile"
              disabled={isBusy || !canSubmitCustomAmount}
              onClick={() => customAmount && void startRecharge(customAmount)}
            >
              {isBusy ? LABELS.loading : LABELS.walletRechargePay}
            </Button>
          </div>
        </FormFieldFrame>
      </div>

      {canSubmitCustomAmount && customPreviewQuery.data ? (
        <p className="mt-3 text-[0.875rem] text-ink-muted">
          {formatLabel(LABELS.walletRechargePreview, {
            points: formatPoints(customPreviewQuery.data.pointsToCredit),
          })}
        </p>
      ) : null}

      {error ? <p className="mt-3 text-body-sm text-danger">{error}</p> : null}
      {successMessage ? (
        <p className="mt-3 text-body-sm text-success">{successMessage}</p>
      ) : null}

      <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-faint">
        {LABELS.walletTermsNotice}
      </p>
    </div>
  );
}
