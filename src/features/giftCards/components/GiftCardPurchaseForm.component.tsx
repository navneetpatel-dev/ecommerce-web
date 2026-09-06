"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { FormFieldFrame, FormStack } from "@/shared/components/forms";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInr } from "@/shared/utils/orderFormat";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import { useGiftCardPurchase } from "../hooks/useGiftCardPurchase.hook";
import {
  GIFT_CARD_MIN_AMOUNT_INR,
  GIFT_CARD_MAX_AMOUNT_INR,
} from "../giftCards.constants";

export function GiftCardPurchaseForm() {
  const { purchase, isBusy, error, successAmount, successEmail, reset } =
    useGiftCardPurchase();
  const [amount, setAmount] = useState<number | undefined>(500);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  if (successAmount != null && successEmail) {
    return (
      <div className="border border-line bg-surface-raised p-6 text-center shadow-elevation-1">
        <h2 className="font-display text-[1.25rem] text-ink">
          {giftCardsLabels.giftCardPurchaseSuccessTitle}
        </h2>
        <p className="mt-2 text-body text-ink-muted">
          {formatLabel(giftCardsLabels.giftCardPurchaseSuccessBody, {
            amount: formatInr(successAmount),
            email: successEmail,
          })}
        </p>
        <Button className="mt-5" variant="outline" onClick={reset}>
          {giftCardsLabels.giftCardBuyAnother}
        </Button>
      </div>
    );
  }

  const canSubmit =
    amount != null &&
    amount >= GIFT_CARD_MIN_AMOUNT_INR &&
    amount <= GIFT_CARD_MAX_AMOUNT_INR &&
    /.+@.+\..+/.test(recipientEmail) &&
    !isBusy;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit || amount == null) return;
        void purchase({
          amount,
          recipientEmail: recipientEmail.trim(),
          recipientName: recipientName.trim() || undefined,
          message: message.trim() || undefined,
        });
      }}
    >
      <FormStack>
        <FormFieldFrame
          label={giftCardsLabels.giftCardAmount}
          htmlFor="gift-card-amount"
          required
          hint={formatLabel(giftCardsLabels.giftCardAmountHint, {
            min: GIFT_CARD_MIN_AMOUNT_INR,
            max: GIFT_CARD_MAX_AMOUNT_INR,
          })}
        >
          <NumberInput
            id="gift-card-amount"
            value={amount}
            onChange={setAmount}
            min={GIFT_CARD_MIN_AMOUNT_INR}
            max={GIFT_CARD_MAX_AMOUNT_INR}
            step={50}
            prefix="₹"
            disabled={isBusy}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={giftCardsLabels.giftCardRecipientEmail}
          htmlFor="gift-card-recipient-email"
          required
        >
          <Input
            id="gift-card-recipient-email"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            disabled={isBusy}
            required
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={giftCardsLabels.giftCardRecipientName}
          htmlFor="gift-card-recipient-name"
        >
          <Input
            id="gift-card-recipient-name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            disabled={isBusy}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={giftCardsLabels.giftCardMessage}
          htmlFor="gift-card-message"
        >
          <Textarea
            id="gift-card-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isBusy}
            maxLength={500}
          />
        </FormFieldFrame>

        {error ? (
          <p role="alert" className="text-body-sm text-danger">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={!canSubmit} fullWidth="mobile">
          {isBusy
            ? giftCardsLabels.giftCardBuyButtonBusy
            : giftCardsLabels.giftCardBuyButton}
        </Button>
      </FormStack>
    </form>
  );
}
