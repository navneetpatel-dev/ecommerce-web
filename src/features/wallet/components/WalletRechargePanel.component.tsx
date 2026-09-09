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
import { walletRechargePanelStyles as styles } from "./walletRechargePanel.styles";

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
    <div className={cn(styles.container, className)}>
      <h2 className={styles.heading}>{LABELS.walletRecharge}</h2>
      <p className={styles.subheading}>{LABELS.walletPointsEqualsInr}</p>
      {limits?.maxBalance ? (
        <p className={styles.maxBalanceNote}>
          {formatLabel(LABELS.walletMaxBalanceCapNote, {
            cap: formatPoints(limits.maxBalance),
          })}
        </p>
      ) : null}

      {presets.length > 0 ? (
        <div className={styles.presetsGrid}>
          {presets.map((preset, index) => {
            const preview = presetPreviewQueries[index]?.data;
            return (
              <Button
                key={preset}
                type="button"
                variant="outline"
                size="sm"
                disabled={isBusy}
                className={styles.presetButton}
                onClick={() => void startRecharge(preset)}
              >
                <span className={styles.presetContent}>
                  <span>{formatInr(preset)}</span>
                  {pointsPerRupee > 1 && preview?.validationCode === "ok" ? (
                    <span className={styles.presetBonusHint}>
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

      <div className={styles.customAmountWrapper}>
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
          <div className={styles.customAmountRow}>
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
        <p className={styles.previewText}>
          {formatLabel(LABELS.walletRechargePreview, {
            points: formatPoints(customPreviewQuery.data.pointsToCredit),
          })}
        </p>
      ) : null}

      {error ? <p className={styles.errorText}>{error}</p> : null}
      {successMessage ? (
        <p className={styles.successText}>{successMessage}</p>
      ) : null}

      <p className={styles.termsNotice}>{LABELS.walletTermsNotice}</p>
    </div>
  );
}
