"use client";

import { Button } from "@/shared/components/ui/button";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import type { WalletBalanceResponse } from "../../api/wallet/wallet.api";
import { cn } from "@/shared/utils/dom/cn";
import { WalletRechargePanelSkeleton } from "../overview/WalletSectionSkeletons.component";
import { walletRechargePanelStyles as styles } from "../../styles/recharge/walletRechargePanel.styles";
import { useWalletRechargePanel } from "../../hooks/recharge/useWalletRechargePanel.hook";
import { WalletRechargePresetButtons } from "./WalletRechargePresetButtons.component";

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
  const panel = useWalletRechargePanel(balance);

  if (isLoading) {
    return <WalletRechargePanelSkeleton className={className} />;
  }

  if (!panel.rechargeEnabled) return null;

  const limitsHint = panel.limits
    ? formatLabel(LABELS.walletRechargeLimitsHint, {
        min: formatInr(panel.limits.minInr),
        max: formatInr(panel.limits.maxInr),
      })
    : undefined;

  return (
    <div className={cn(styles.container, className)}>
      <h2 className={styles.heading}>{LABELS.walletRecharge}</h2>
      <p className={styles.subheading}>{LABELS.walletPointsEqualsInr}</p>
      {panel.limits?.maxBalance ? (
        <p className={styles.maxBalanceNote}>
          {formatLabel(LABELS.walletMaxBalanceCapNote, {
            cap: formatPoints(panel.limits.maxBalance),
          })}
        </p>
      ) : null}

      {panel.presets.length > 0 ? (
        <WalletRechargePresetButtons
          presets={panel.presets}
          previews={panel.presetPreviewQueries}
          pointsPerRupee={panel.pointsPerRupee}
          disabled={panel.isBusy}
          onSelect={(amount) => void panel.startRecharge(amount)}
        />
      ) : null}

      <div className={styles.customAmountWrapper}>
        <FormFieldFrame
          label={LABELS.walletRechargeCustomAmount}
          htmlFor="wallet-recharge-amount"
          error={panel.amountError ?? undefined}
          hint={limitsHint}
        >
          <div className={styles.customAmountRow}>
            <NumberInput
              id="wallet-recharge-amount"
              value={panel.customAmount}
              min={panel.limits?.minInr}
              max={panel.limits?.maxInr}
              step={50}
              prefix="₹"
              disabled={panel.isBusy}
              showSteppers={false}
              error={Boolean(panel.amountError)}
              onChange={panel.onCustomAmountChange}
            />
            <Button
              type="button"
              fullWidth="mobile"
              disabled={panel.isBusy || !panel.canSubmitCustomAmount}
              onClick={panel.submitCustomAmount}
            >
              {panel.isBusy ? LABELS.loading : LABELS.walletRechargePay}
            </Button>
          </div>
        </FormFieldFrame>
      </div>

      {panel.canSubmitCustomAmount && panel.customPreviewQuery.data ? (
        <p className={styles.previewText}>
          {formatLabel(LABELS.walletRechargePreview, {
            points: formatPoints(panel.customPreviewQuery.data.pointsToCredit),
          })}
        </p>
      ) : null}

      {panel.error ? <p className={styles.errorText}>{panel.error}</p> : null}
      {panel.successMessage ? (
        <p className={styles.successText}>{panel.successMessage}</p>
      ) : null}

      <p className={styles.termsNotice}>{LABELS.walletTermsNotice}</p>
    </div>
  );
}
