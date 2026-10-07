"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import {
  DisabledActionHint,
  FormFieldFrame,
  FormStack,
} from "@/shared/components/forms";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  CURRENCY_SYMBOL,
  formatInr,
} from "@/shared/utils/formatting/orderFormat";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import { useGiftCardPurchase } from "../../hooks/purchase/useGiftCardPurchase.hook";
import {
  GIFT_CARD_MIN_AMOUNT_INR,
  GIFT_CARD_MAX_AMOUNT_INR,
} from "../../constants/gift-cards/giftCards.constants";
import { giftCardPurchaseFormStyles as styles } from "../../styles/purchase/giftCardPurchaseForm.styles";

export function GiftCardPurchaseForm() {
  const { purchase, isBusy, error, successAmount, successEmail, reset } =
    useGiftCardPurchase();
  const [amount, setAmount] = useState<number | undefined>(500);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");

  if (successAmount != null && successEmail) {
    return (
      <div className={styles.successCard}>
        <h2 className={styles.successTitle}>
          {giftCardsLabels.giftCardPurchaseSuccessTitle}
        </h2>
        <p className={styles.successBody}>
          {formatLabel(giftCardsLabels.giftCardPurchaseSuccessBody, {
            amount: formatInr(successAmount),
            email: successEmail,
          })}
        </p>
        <Button
          className={styles.buyAnotherButton}
          variant="outline"
          onClick={reset}
        >
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

  const showIncompleteHint = !isBusy && !canSubmit;

  const handleAmountChange = (value: number | undefined) => {
    setAmount(value);
  };

  const handleRecipientEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRecipientEmail(event.target.value);
  };

  const handleRecipientNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRecipientName(event.target.value);
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || amount == null) return;
    void purchase({
      amount,
      recipientEmail: recipientEmail.trim(),
      recipientName: recipientName.trim() || undefined,
      message: message.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormStack>
        <FormFieldFrame
          label={giftCardsLabels.giftCardAmount}
          htmlFor="gift-card-amount"
          required
          hint={formatLabel(giftCardsLabels.giftCardAmountHint, {
            min: formatInr(GIFT_CARD_MIN_AMOUNT_INR),
            max: formatInr(GIFT_CARD_MAX_AMOUNT_INR),
          })}
        >
          <NumberInput
            id="gift-card-amount"
            value={amount}
            onChange={handleAmountChange}
            min={GIFT_CARD_MIN_AMOUNT_INR}
            max={GIFT_CARD_MAX_AMOUNT_INR}
            step={50}
            prefix={CURRENCY_SYMBOL}
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
            autoComplete="off"
            value={recipientEmail}
            onChange={handleRecipientEmailChange}
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
            onChange={handleRecipientNameChange}
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
            onChange={handleMessageChange}
            disabled={isBusy}
            maxLength={500}
          />
        </FormFieldFrame>

        {error ? (
          <p role="alert" className={styles.errorText}>
            {error}
          </p>
        ) : null}

        <DisabledActionHint
          disabled={!canSubmit}
          message={
            showIncompleteHint ? giftCardsLabels.giftCardFormInvalidHint : ""
          }
          className={styles.submitHintWrapper}
        >
          <Button type="submit" disabled={!canSubmit} fullWidth="mobile">
            {isBusy
              ? giftCardsLabels.giftCardBuyButtonBusy
              : giftCardsLabels.giftCardBuyButton}
          </Button>
        </DisabledActionHint>
      </FormStack>
    </form>
  );
}
