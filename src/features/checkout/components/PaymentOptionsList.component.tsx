import { memo } from "react";
import { CreditCard, Banknote, Wallet } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PaymentMethodOption } from "./PaymentMethodOption.component";
import { PAYMENT_STEP_STYLES } from "./paymentStep.styles";

interface PaymentOptionsListProps {
  selectedMethod?: string | null;
  isPending: boolean;
  canUseCod: boolean;
  canUseWallet: boolean;
  onSelect: (methodId: string) => void;
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

export const PaymentOptionsList = memo(function PaymentOptionsList({
  selectedMethod,
  isPending,
  canUseCod,
  canUseWallet,
  onSelect,
}: PaymentOptionsListProps) {
  return (
    <div className={PAYMENT_STEP_STYLES.methodsList}>
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

        const handleSelectOption = () => onSelect(method.id);

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
            onSelect={handleSelectOption}
          />
        );
      })}
    </div>
  );
});
