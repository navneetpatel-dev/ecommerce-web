import type { CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { Button } from "@/shared/components/ui/button";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { Textarea } from "@/shared/components/ui/textarea";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { VendorBreakdownCard } from "./ReviewStep/VendorBreakdownCard.component";
import { PayableSummary } from "./ReviewStep/PayableSummary.component";

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

  if (!quote && isQuoteError) {
    return (
      <div className="space-y-5">
        <div className="border border-danger bg-danger-subtle px-5 py-8">
          <p className="font-display text-[1.125rem] text-danger-foreground">
            {LABELS.summaryLoadFailed}
          </p>
          {quoteErrorMessage ? (
            <p className="mt-1 text-[0.875rem] text-danger-foreground/90">
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
      <div className="space-y-5">
        <div className="border border-line bg-paper/60 px-5 py-8">
          <p className="font-display text-[1.125rem] text-ink">
            {LABELS.preparingSummary}
          </p>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            {LABELS.calculatingShippingTaxes}
          </p>
        </div>
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToPayment}
        </Button>
      </div>
    );
  }

  const payable = quote.amountDue;
  const showsUnavailableWarning = Boolean(hasUnavailableItems);

  const renderBreakdown = (
    breakdown: (typeof quote.vendorBreakdowns)[number],
  ) => <VendorBreakdownCard key={breakdown.vendorId} breakdown={breakdown} />;

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {quote.vendorBreakdowns.map(renderBreakdown)}
      </div>

      <div className="space-y-2 border border-line bg-surface-raised p-4">
        <CheckboxField
          id="checkout-gift-wrap"
          checked={giftWrap}
          onCheckedChange={(checked) => onGiftWrapChange?.(checked)}
          label={LABELS.giftWrapOption}
        />
        <p className="text-body-sm text-ink-muted">
          {LABELS.giftWrapOptionHint}
        </p>
        {giftWrap ? (
          <Textarea
            value={giftMessage}
            onChange={(e) => onGiftMessageChange?.(e.target.value)}
            placeholder={LABELS.giftWrapMessagePlaceholder}
            rows={3}
            maxLength={500}
            className="mt-2"
          />
        ) : null}
      </div>

      <PayableSummary quote={quote} payable={payable} />

      {showsUnavailableWarning ? <UnavailableItemsWarning /> : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={onBack} fullWidth="mobile">
          {LABELS.backToPayment}
        </Button>
        <Button
          size="lg"
          fullWidth="mobile"
          className="gap-2"
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

function UnavailableItemsWarning() {
  return (
    <div className="flex items-start gap-2 rounded-sm border border-warning bg-warning-subtle px-4 py-3">
      <AlertTriangle
        size={16}
        className="mt-0.5 shrink-0 text-warning"
        aria-hidden
      />
      <p className="text-[0.875rem] text-warning-foreground">
        {LABELS.removeUnavailableToCheckout}
      </p>
    </div>
  );
}
