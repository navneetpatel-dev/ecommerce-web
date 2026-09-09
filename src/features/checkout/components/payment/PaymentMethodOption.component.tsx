import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { PAYMENT_METHOD_OPTION_STYLES } from "../../styles/payment/paymentMethodOption.styles";

interface PaymentMethodOptionProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  disabled: boolean;
  disabledMessage?: string;
  onSelect: () => void;
}

/** A single selectable payment-method card, with an optional disabled-reason tooltip. */
export function PaymentMethodOption({
  title,
  description,
  icon: Icon,
  selected,
  disabled,
  disabledMessage,
  onSelect,
}: PaymentMethodOptionProps) {
  const button = (
    <Button
      type="button"
      variant="outline"
      aria-pressed={selected}
      onClick={onSelect}
      disabled={disabled}
      className={PAYMENT_METHOD_OPTION_STYLES.button(selected)}
    >
      <span className={PAYMENT_METHOD_OPTION_STYLES.iconWrapper(selected)}>
        <Icon size={18} />
      </span>
      <span className={PAYMENT_METHOD_OPTION_STYLES.textWrapper}>
        <span className={PAYMENT_METHOD_OPTION_STYLES.title}>{title}</span>
        <span className={PAYMENT_METHOD_OPTION_STYLES.description}>
          {description}
        </span>
      </span>
      <span
        className={PAYMENT_METHOD_OPTION_STYLES.indicatorRing(selected)}
        aria-hidden
      >
        {selected && (
          <span className={PAYMENT_METHOD_OPTION_STYLES.indicatorDot} />
        )}
      </span>
    </Button>
  );

  if (disabledMessage) {
    return (
      <DisabledActionHint
        disabled
        message={disabledMessage}
        className={PAYMENT_METHOD_OPTION_STYLES.wrapper}
      >
        {button}
      </DisabledActionHint>
    );
  }

  return <div className={PAYMENT_METHOD_OPTION_STYLES.wrapper}>{button}</div>;
}
