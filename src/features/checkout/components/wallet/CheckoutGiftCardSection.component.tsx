"use client";

import { Gift } from "lucide-react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { useCheckoutGiftCard } from "../../hooks/wallet/useCheckoutGiftCard.hook";
import { CHECKOUT_GIFT_CARD_STYLES as styles } from "../../styles/wallet/checkoutGiftCard.styles";

interface CheckoutGiftCardSectionProps {
  disabled?: boolean;
  onSelect: (method: string) => void;
  onWalletAmountChange: (amount: number) => void;
}

const INPUT_ID = "checkout-gift-card-code";

/** Redeem a gift card during checkout; its value pays for the order through the wallet. */
export function CheckoutGiftCardSection({
  disabled = false,
  onSelect,
  onWalletAmountChange,
}: CheckoutGiftCardSectionProps) {
  const { code, pending, error, canApply, handleCodeChange, handleSubmit } =
    useCheckoutGiftCard({ onSelect, onWalletAmountChange });

  return (
    <section className={styles.root} aria-labelledby={`${INPUT_ID}-title`}>
      <div>
        <h3 id={`${INPUT_ID}-title`} className={styles.title}>
          {LABELS.checkoutGiftCardTitle}
        </h3>
        <p className={styles.hint}>{LABELS.checkoutGiftCardHint}</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormFieldFrame
          label={LABELS.checkoutGiftCardCode}
          htmlFor={INPUT_ID}
          error={error ?? undefined}
          className={styles.field}
        >
          <Input
            id={INPUT_ID}
            value={code}
            onChange={handleCodeChange}
            disabled={disabled || pending}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={24}
            className={styles.input}
          />
        </FormFieldFrame>
        <Button
          type="submit"
          variant="outline"
          loading={pending}
          disabled={disabled || !canApply}
        >
          <Gift aria-hidden />
          <span>{LABELS.checkoutGiftCardApply}</span>
        </Button>
      </form>
    </section>
  );
}
