import { ArrowRight, CreditCard, Banknote, Wallet } from "lucide-react";
import type { CheckoutQuote } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { WalletApplySection } from "./WalletApplySection.component";

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
          const Icon = method.icon;
          const selected = selectedMethod === method.id;
          const isCod = method.id === "cod";
          const isWallet = method.id === "wallet";
          const methodDisabled =
            isPending ||
            (isCod && !canUseCod) ||
            (isWallet && !canUseWallet);
          const button = (
            <Button
              type="button"
              variant="outline"
              aria-pressed={selected}
              onClick={() => handleSelect(method.id)}
              disabled={methodDisabled}
              className={cn(
                "h-auto min-h-11 max-h-none w-full items-start gap-4 px-4 py-4 text-left font-normal",
                selected
                  ? "border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)] hover:bg-brand-subtle hover:text-ink"
                  : "border-line hover:border-ink/25",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                  selected
                    ? "border-brand/40 bg-surface text-brand"
                    : "border-line bg-paper text-ink-muted",
                )}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">
                  {method.title}
                </span>
                <span className="mt-0.5 block text-[0.875rem] text-ink-muted">
                  {method.description}
                </span>
              </span>
              <span
                className={cn(
                  "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-brand bg-brand" : "border-line bg-surface",
                )}
                aria-hidden
              >
                {selected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-paper" />
                )}
              </span>
            </Button>
          );
          if (isCod && !canUseCod) {
            return (
              <DisabledActionHint
                key={method.id}
                disabled
                message={LABELS.codUnavailable}
                className="w-full"
              >
                {button}
              </DisabledActionHint>
            );
          }
          if (isWallet && !canUseWallet) {
            return (
              <DisabledActionHint
                key={method.id}
                disabled
                message={LABELS.paymentMethodWalletUnavailable}
                className="w-full"
              >
                {button}
              </DisabledActionHint>
            );
          }
          return (
            <div key={method.id} className="w-full">
              {button}
            </div>
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
