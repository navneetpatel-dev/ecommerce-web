import { ArrowRight, CreditCard, Banknote, Wallet } from "lucide-react";
import type { CheckoutQuote } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { WalletApplySection } from "./WalletApplySection.component";
import { PaymentMethodOption } from "./PaymentMethodOption.component";

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

const METHODS = [
  {
    id: "razorpay",
    title: LABELS.paymentMethodRazorpay,
    description: LABELS.paymentMethodRazorpayDesc,
    icon: CreditCard,
  },
  {
    id: "cod",
    title: LABELS.paymentMethodCod,
    description: LABELS.paymentMethodCodDesc,
    icon: Banknote,
  },
  {
    id: "wallet",
    title: LABELS.paymentMethodWallet,
    description: LABELS.paymentMethodWalletDesc,
    icon: Wallet,
  },
] as const;

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
  const walletBalance = quote?.walletBalance ?? 0;
  const amountDue = quote?.amountDue;
  const maxApplicable = quote?.maxWalletApplicable ?? 0;
  const walletSelected = selectedMethod === "wallet";
  const canUseCod = quote?.codAvailable === true;
  const canUseWallet = Boolean(quote) && walletBalance > 0 && maxApplicable > 0;
  const walletReady = walletSelected && walletAmountToUse > 0;

  const canContinue =
    Boolean(selectedMethod) &&
    (selectedMethod !== "cod" || canUseCod) &&
    (selectedMethod !== "wallet" || walletReady);

  const continueHint = !selectedMethod
    ? LABELS.selectPaymentMethodToContinue
    : selectedMethod === "wallet" && !walletReady
      ? LABELS.selectWalletAmountToContinue
      : LABELS.selectPaymentMethodToContinue;

  const handleSelect = (methodId: string) => {
    onSelect(methodId);
    if (methodId === "wallet") {
      onWalletAmountChange(maxApplicable);
    } else {
      onWalletAmountChange(0);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {METHODS.map((method) => {
          const isCod = method.id === "cod";
          const isWallet = method.id === "wallet";
          const methodDisabled =
            isPending || (isCod && !canUseCod) || (isWallet && !canUseWallet);
          const disabledMessage =
            isCod && !canUseCod
              ? LABELS.codUnavailable
              : isWallet && !canUseWallet
                ? LABELS.paymentMethodWalletUnavailable
                : undefined;

          return (
            <PaymentMethodOption
              key={method.id}
              id={method.id}
              title={method.title}
              description={method.description}
              icon={method.icon}
              selected={selectedMethod === method.id}
              disabled={methodDisabled}
              disabledMessage={disabledMessage}
              onSelect={() => handleSelect(method.id)}
            />
          );
        })}
      </div>

      {walletSelected ? (
        <div className="space-y-2">
          <WalletApplySection
            walletBalance={walletBalance}
            maxApplicable={maxApplicable}
            walletAmountToUse={walletAmountToUse}
            amountDue={amountDue}
            disabled={isPending || !quote}
            onAmountChange={onWalletAmountChange}
          />
          {walletAmountToUse > 0 && amountDue != null && amountDue > 0 ? (
            <p className="text-body-sm text-ink-muted">
              {formatLabel(LABELS.paymentMethodWalletRemainderDue, {
                amount: `₹${formatInrAmount(amountDue)}`,
              })}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToShipping}
        </Button>
        <DisabledActionHint
          disabled={!canContinue}
          message={continueHint}
          className="w-full sm:w-auto"
        >
          <Button
            size="lg"
            onClick={onContinue}
            disabled={!canContinue || isPending}
            fullWidth="mobile"
            className="gap-2"
          >
            {LABELS.continueToReview}
            <ArrowRight size={16} />
          </Button>
        </DisabledActionHint>
      </div>
    </div>
  );
}
