"use client";

import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { LABELS } from "@/shared/constants/labels";
import { useWalletApplySection } from "./useWalletApplySection.hook";
import { WALLET_APPLY_SECTION_STYLES } from "./walletApplySection.styles";

interface WalletApplySectionProps {
  walletBalance: number;
  maxApplicable: number;
  walletAmountToUse: number;
  amountDue?: number;
  disabled?: boolean;
  onAmountChange: (amount: number) => void;
}

export function WalletApplySection({
  walletBalance,
  maxApplicable,
  walletAmountToUse,
  amountDue,
  disabled,
  onAmountChange,
}: WalletApplySectionProps) {
  const {
    formattedPoints,
    remainderHint,
    handleUseAll,
    handleNumberChange,
    showFullyCovers,
  } = useWalletApplySection({
    walletBalance,
    maxApplicable,
    walletAmountToUse,
    amountDue,
    onAmountChange,
  });

  if (walletBalance <= 0) return null;

  return (
    <div className={WALLET_APPLY_SECTION_STYLES.root}>
      <div className={WALLET_APPLY_SECTION_STYLES.headerRow}>
        <div>
          <p className={WALLET_APPLY_SECTION_STYLES.title}>
            {LABELS.walletApplyPoints}
          </p>
          <p className={WALLET_APPLY_SECTION_STYLES.pointsValue}>
            {formattedPoints}
          </p>
          <p className={WALLET_APPLY_SECTION_STYLES.subtitle}>
            {LABELS.walletPointsEqualsInr}
          </p>
        </div>
        {maxApplicable > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={handleUseAll}
          >
            {LABELS.walletUseAll}
          </Button>
        ) : null}
      </div>

      <FormFieldFrame
        label={LABELS.walletAmountToApply}
        htmlFor="wallet-amount"
        hint={remainderHint}
      >
        <NumberInput
          id="wallet-amount"
          value={walletAmountToUse || undefined}
          min={0}
          max={maxApplicable}
          step={0.01}
          prefix="₹"
          disabled={disabled}
          showSteppers={false}
          onChange={handleNumberChange}
        />
      </FormFieldFrame>

      {showFullyCovers ? (
        <p className={WALLET_APPLY_SECTION_STYLES.fullyCoversText}>
          {LABELS.walletFullyCoversOrder}
        </p>
      ) : null}
    </div>
  );
}
