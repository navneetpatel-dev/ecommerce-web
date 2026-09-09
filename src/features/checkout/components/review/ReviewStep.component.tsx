"use client";

import type { CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { Button } from "@/shared/components/ui/button";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { Textarea } from "@/shared/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { PayableSummary } from "./ReviewStep/PayableSummary.component";
import { VendorBreakdownsList } from "./VendorBreakdownsList.component";
import { UnavailableItemsWarning } from "./UnavailableItemsWarning.component";
import { useReviewStep } from "../../hooks/review/useReviewStep.hook";
import { REVIEW_STEP_STYLES } from "../../styles/review/reviewStep.styles";

interface ReviewStepProps {
  quote: CheckoutQuote | null;
  isQuoteLoading?: boolean;
  isQuoteError?: boolean;
  quoteErrorMessage?: string;
  isPending: boolean;
  hasUnavailableItems?: boolean;
  giftWrap?: boolean;
  giftMessage?: string;
  onGiftWrapChange?: (giftWrap: boolean) => void;
  onGiftMessageChange?: (giftMessage: string) => void;
  onPlaceOrder: () => void;
  onBack: () => void;
}

/** Order review step: vendor breakdowns + payable summary + actions. */
export function ReviewStep(props: ReviewStepProps) {
  const {
    quote,
    isQuoteError,
    quoteErrorMessage,
    isPending,
    hasUnavailableItems,
    giftWrap = false,
    giftMessage = "",
    onGiftWrapChange,
    onGiftMessageChange,
    onPlaceOrder,
    onBack,
  } = props;

  const {
    payable,
    showsUnavailableWarning,
    handleGiftWrapCheckedChange,
    handleGiftMessageChange,
  } = useReviewStep({
    quote,
    hasUnavailableItems,
    onGiftWrapChange,
    onGiftMessageChange,
  });

  if (!quote && isQuoteError) {
    return (
      <div className={REVIEW_STEP_STYLES.root}>
        <div className={REVIEW_STEP_STYLES.errorContainer}>
          <p className={REVIEW_STEP_STYLES.errorTitle}>
            {LABELS.summaryLoadFailed}
          </p>
          {quoteErrorMessage ? (
            <p className={REVIEW_STEP_STYLES.errorMessage}>
              {quoteErrorMessage}
            </p>
          ) : null}
        </div>
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToPayment}
        </Button>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className={REVIEW_STEP_STYLES.root}>
        <div className={REVIEW_STEP_STYLES.preparingContainer}>
          <p className={REVIEW_STEP_STYLES.preparingTitle}>
            {LABELS.preparingSummary}
          </p>
          <p className={REVIEW_STEP_STYLES.preparingSubtitle}>
            {LABELS.calculatingShippingTaxes}
          </p>
        </div>
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToPayment}
        </Button>
      </div>
    );
  }

  return (
    <div className={REVIEW_STEP_STYLES.root}>
      <VendorBreakdownsList breakdowns={quote.vendorBreakdowns} />

      <div className={REVIEW_STEP_STYLES.giftWrapContainer}>
        <CheckboxField
          id="checkout-gift-wrap"
          checked={giftWrap}
          onCheckedChange={handleGiftWrapCheckedChange}
          label={LABELS.giftWrapOption}
        />
        <p className={REVIEW_STEP_STYLES.giftWrapHint}>
          {LABELS.giftWrapOptionHint}
        </p>
        {giftWrap ? (
          <Textarea
            value={giftMessage}
            onChange={handleGiftMessageChange}
            placeholder={LABELS.giftWrapMessagePlaceholder}
            rows={3}
            maxLength={500}
            className={REVIEW_STEP_STYLES.giftMessageTextarea}
          />
        ) : null}
      </div>

      <PayableSummary quote={quote} payable={payable} />

      {showsUnavailableWarning ? <UnavailableItemsWarning /> : null}

      <div className={REVIEW_STEP_STYLES.actionsRow}>
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToPayment}
        </Button>
        <Button
          size="lg"
          fullWidth="mobile"
          className={REVIEW_STEP_STYLES.placeOrderBtn}
          onClick={onPlaceOrder}
          loading={isPending}
          disabled={showsUnavailableWarning}
        >
          {LABELS.placeOrder}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
