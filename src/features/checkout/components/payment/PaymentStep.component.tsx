"use client";

import { ArrowRight } from "lucide-react";
import type { CheckoutQuote } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { WalletApplySection } from "../wallet/WalletApplySection.component";
import { PaymentOptionsList } from "./PaymentOptionsList.component";
import { usePaymentStep } from "../../hooks/payment/usePaymentStep.hook";
import { PAYMENT_STEP_STYLES } from "../../styles/payment/paymentStep.styles";

interface PaymentStepProps {
  isPending: boolean;
  selectedMethod?: string | null;
  quote?: CheckoutQuote | null;
  walletAmountToUse: number;
  onSelect: (method: string) => void;
  onWalletAmountChange: (amount: number) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function PaymentStep({
  isPending,
  selectedMethod,
  quote,
  walletAmountToUse,
  onSelect,
  onWalletAmountChange,
  onContinue,
  onBack,
}: PaymentStepProps) {
  const {
    walletBalance,
    amountDue,
    maxApplicable,
    walletSelected,
    canUseCod,
    canUseWallet,
    canContinue,
    continueHint,
    handleSelectMethod,
    remainderDueText,
  } = usePaymentStep({
    isPending,
    selectedMethod,
    quote,
    walletAmountToUse,
    onSelect,
    onWalletAmountChange,
  });

  return (
    <div className={PAYMENT_STEP_STYLES.root}>
      <PaymentOptionsList
        selectedMethod={selectedMethod}
        isPending={isPending}
        canUseCod={canUseCod}
        canUseWallet={canUseWallet}
        onSelect={handleSelectMethod}
      />

      {walletSelected ? (
        <div className={PAYMENT_STEP_STYLES.walletWrapper}>
          <WalletApplySection
            walletBalance={walletBalance}
            maxApplicable={maxApplicable}
            walletAmountToUse={walletAmountToUse}
            amountDue={amountDue}
            disabled={isPending || !quote}
            onAmountChange={onWalletAmountChange}
          />
          {remainderDueText ? (
            <p className={PAYMENT_STEP_STYLES.walletRemainderText}>
              {remainderDueText}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={PAYMENT_STEP_STYLES.actionsRow}>
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToShipping}
        </Button>
        <DisabledActionHint
          disabled={!canContinue}
          message={continueHint}
          className={PAYMENT_STEP_STYLES.actionHint}
        >
          <Button
            size="lg"
            onClick={onContinue}
            disabled={!canContinue || isPending}
            fullWidth="mobile"
            className={PAYMENT_STEP_STYLES.continueBtn}
          >
            {LABELS.continueToReview}
            <ArrowRight size={16} />
          </Button>
        </DisabledActionHint>
      </div>
    </div>
  );
}
