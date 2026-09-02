"use client";

import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatPoints } from "@/shared/utils/formatPoints";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface WalletApplySectionProps {
  walletBalance: number;
  maxApplicable: number;
  walletAmountToUse: number;
  amountDue?: number;
  disabled?: boolean;
  onAmountChange: (amount: number) => void;
}

function formatPointsValue(value: number) {
  return formatPoints(value);
}

export function WalletApplySection({
  walletBalance,
  maxApplicable,
  walletAmountToUse,
  amountDue,
  disabled,
  onAmountChange,
}: WalletApplySectionProps) {
  if (walletBalance <= 0) return null;

  return (
    <div className="space-y-3 border border-line bg-paper/40 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-body-sm font-medium text-ink">
            {LABELS.walletApplyPoints}
          </p>
          <p className="mt-0.5 font-display text-[1.25rem] tabular-nums text-brand">
            {formatPointsValue(walletBalance)}
          </p>
          <p className="mt-1 text-[0.75rem] text-ink-muted">
            {LABELS.walletPointsEqualsInr}
          </p>
        </div>
        {maxApplicable > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onAmountChange(maxApplicable)}
          >
            {LABELS.walletUseAll}
          </Button>
        ) : null}
      </div>

      <FormFieldFrame
        label={LABELS.walletAmountToApply}
        htmlFor="wallet-amount"
        hint={formatLabel(LABELS.walletRemainderDue, {
          amount:
            amountDue != null
              ? `₹${formatInrAmount(amountDue)}`
              : "Updating…",
        })}
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
          onChange={(value) => onAmountChange(value ?? 0)}
        />
      </FormFieldFrame>
      {amountDue != null && amountDue <= 0 && walletAmountToUse > 0 ? (
        <p className="text-body-sm font-medium text-success">
          {LABELS.walletFullyCoversOrder}
        </p>
      ) : null}
    </div>
  );
}
